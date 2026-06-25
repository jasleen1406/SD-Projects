const path = require("path");
const http = require("http");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const socketio = require("socket.io");
const Filter = require("bad-words");
const crypto = require("crypto");
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");
const User = require("./models/user");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const mongoUri = process.env.MONGO_URI;
const mongoEnabled = Boolean(mongoUri);
const localAuthUsers = [];
const roomOwners = {};
const roomMessages = {};

const normalizeRoom = room => room.trim().toLowerCase();

const getRoomOwner = room => {
  room = normalizeRoom(room);
  return roomOwners[room] || null;
};

const addRoomMessage = (room, message) => {
  room = normalizeRoom(room);
  if (!roomMessages[room]) {
    roomMessages[room] = [];
  }
  roomMessages[room].push(message);
  if (roomMessages[room].length > 200) {
    roomMessages[room].shift();
  }
};

const setRoomOwner = (room, ownerId, ownerName) => {
  room = normalizeRoom(room);
  roomOwners[room] = { ownerId, ownerName };
};

const clearRoomOwner = room => {
  room = normalizeRoom(room);
  delete roomOwners[room];
};

const assignNextRoomOwner = room => {
  room = normalizeRoom(room);
  const users = getUsersInRoom(room);
  if (users.length > 0) {
    roomOwners[room] = {
      ownerId: users[0].id,
      ownerName: users[0].username
    };

    return roomOwners[room];
  }

  delete roomOwners[room];
  return null;
};

if (mongoEnabled) {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI is not set. Running without MongoDB. Session storage will use the default in-memory store.");
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionConfig = {
  secret: process.env.SESSION_SECRET || "chat-app-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "lax"
  }
};

if (mongoEnabled) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: mongoUri,
    ttl: 14 * 24 * 60 * 60
  });
} else {
  console.warn("No Mongo session store configured. Session data will be stored in MemoryStore.");
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleAuthEnabled = Boolean(googleClientID && googleClientSecret);
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiEnabled = Boolean(openaiApiKey);
const openaiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const findAuthUser = async email => {
  if (mongoEnabled) {
    return User.findOne({ email: email.toLowerCase() });
  }
  return localAuthUsers.find(user => user.email === email.toLowerCase());
};

const findAuthUserById = async id => {
  if (mongoEnabled) {
    return User.findById(id);
  }
  return localAuthUsers.find(user => user.id === id);
};

const createAuthUser = async ({ email, username, passwordHash, googleId }) => {
  const payload = {
    email: email.toLowerCase(),
    username,
    passwordHash,
    googleId
  };

  if (mongoEnabled) {
    return User.create(payload);
  }

  const user = {
    ...payload,
    id: crypto.randomUUID()
  };

  localAuthUsers.push(user);
  return user;
};

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await findAuthUser(email);
      if (!user || !user.passwordHash) {
        return done(null, false, { message: "Invalid email or password." });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return done(null, false, { message: "Invalid email or password." });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

if (googleAuthEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: "/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await User.findOne({ googleId: profile.id });
          if (!existingUser && !mongoEnabled) {
            existingUser = localAuthUsers.find(user => user.googleId === profile.id);
          }

          if (existingUser) {
            return done(null, existingUser);
          }

          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
          const username = profile.displayName || email.split("@")[0] || "GoogleUser";

          const user = await createAuthUser({
            googleId: profile.id,
            username,
            email,
            passwordHash: undefined
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findAuthUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const finishLogin = (req, res, next) => {
  req.session.save(err => {
    if (err) {
      console.error("Session save error:", err);
      return next(err);
    }

    res.redirect(303, "/join");
  });
};

app.get("/auth/google", (req, res, next) => {
  if (!googleAuthEnabled) {
    return res.redirect("/login");
  }

  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

app.get("/auth/google/callback", (req, res, next) => {
  if (!googleAuthEnabled) {
    return res.redirect("/login");
  }

  passport.authenticate("google", { failureRedirect: "/login?error=1" }, (err, user) => {
    if (err || !user) {
      console.error("Google auth error:", err);
      return res.redirect("/login?error=1");
    }

    req.logIn(user, loginErr => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.redirect("/login?error=1");
      }

      finishLogin(req, res, next);
    });
  })(req, res, next);
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", { failureRedirect: "/login?error=1" }, (err, user) => {
    if (err) {
      console.error("Login error:", err);
      return res.redirect("/login?error=1");
    }

    if (!user) {
      return res.redirect("/login?error=1");
    }

    req.logIn(user, loginErr => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.redirect("/login?error=1");
      }

      finishLogin(req, res, next);
    });
  })(req, res, next);
});

app.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.redirect("/login?error=2");
    }

    const existing = await findAuthUser(email);
    if (existing) {
      return res.redirect("/login?error=3");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createAuthUser({
      username,
      email,
      passwordHash,
      googleId: undefined
    });

    req.logIn(user, loginErr => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.redirect("/login?error=1");
      }

      finishLogin(req, res, next);
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.redirect("/login?error=2");
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/api/me", (req, res) => {
  if (!req.user) {
    return res.json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    username: req.user.username,
    email: req.user.email
  });
});

app.get("/api/auth-config", (req, res) => {
  res.json({
    googleAuthEnabled,
    mongoEnabled
  });
});


const authRequired = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
};

app.get(["/", "/index.html", "/join"], authRequired, (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "index.html"));
});

app.get("/chat.html", authRequired, (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "chat.html"));
});

app.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/join");
  }

  res.sendFile(path.join(publicDirectoryPath, "login.html"));
});

app.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/join");
  }

  res.sendFile(path.join(publicDirectoryPath, "login.html"));
});

app.use(express.static(publicDirectoryPath));

io.on("connection", socket => {
  console.log("New WebSocket connection");

  socket.on("join", (options, callback) => {
    const { error, user, reconnecting } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    } else {
      socket.join(user.room);

      if (!getRoomOwner(user.room)) {
        setRoomOwner(user.room, socket.id, user.username);
      }

      const history = roomMessages[user.room] || [];
      socket.emit("roomHistory", history);

      if (!reconnecting) {
        const welcome = generateMessage("Admin", "Welcome!");
        addRoomMessage(user.room, welcome);
        socket.emit("message", welcome);

        const joined = generateMessage("Admin", `${user.username} has joined!`);
        addRoomMessage(user.room, joined);
        socket.broadcast.to(user.room).emit("message", joined);
      }

      const owner = getRoomOwner(user.room);
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
        ownerId: owner ? owner.ownerId : null,
        ownerName: owner ? owner.ownerName : null
      });

      callback();
    }
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    } else {
      const msg = generateMessage(user.username, message);
      addRoomMessage(user.room, msg);
      io.to(user.room).emit("message", msg);
      callback();
    }
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    const locationMsg = generateLocationMessage(
      user.username,
      `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    addRoomMessage(user.room, locationMsg);
    io.to(user.room).emit("locationMessage", locationMsg);
    callback();
  });

  
  socket.on("leaveRoom", callback => {
    const user = getUser(socket.id);

    if (!user) {
      if (callback) {
        return callback("User not found.");
      }
      return;
    }

    const owner = getRoomOwner(user.room);
    removeUser(socket.id);
    socket.leave(user.room);

    socket.emit("message", generateMessage("Admin", "You left the room."));
    socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));

    if (owner && owner.ownerId === user.id) {
      const nextOwner = assignNextRoomOwner(user.room);
      if (nextOwner) {
        io.to(user.room).emit("message", generateMessage("Admin", `${nextOwner.ownerName} is now the room owner.`));
      }
    }

    const roomOwner = getRoomOwner(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
      ownerId: roomOwner ? roomOwner.ownerId : null,
      ownerName: roomOwner ? roomOwner.ownerName : null
    });

    if (callback) {
      callback();
    }
  });

  const clearRoomHistory = room => {
    room = normalizeRoom(room);
    if (roomMessages[room]) {
      roomMessages[room].length = 0;
      delete roomMessages[room];
    }
  };

  socket.on("endRoom", callback => {
    const user = getUser(socket.id);

    if (!user) {
      return callback("Unable to end room.");
    }

    const owner = getRoomOwner(user.room);
    if (!owner || owner.ownerId !== socket.id) {
      return callback("Only the room creator can end this room.");
    }

    const room = normalizeRoom(user.room);
    const usersInRoom = getUsersInRoom(room);

    // Announce the room end to everyone still connected.
    io.to(room).emit("roomEnded", { message: "This room has been ended by " + user.username + "." });

    // Clear saved history so the room is fresh for future visitors.
    clearRoomHistory(room);
    clearRoomOwner(room);

    // Remove each user from the room before disconnecting, so disconnect handlers
    // do not emit leave messages after the room has already ended.
    usersInRoom.forEach(roomUser => {
      removeUser(roomUser.id);

      let roomSocket;
      try {
        if (io.sockets && io.sockets.sockets) {
          if (typeof io.sockets.sockets.get === "function") {
            roomSocket = io.sockets.sockets.get(roomUser.id);
          } else if (io.sockets.sockets[roomUser.id]) {
            roomSocket = io.sockets.sockets[roomUser.id];
          }
        }
      } catch (e) {
        roomSocket = null;
      }

      if (!roomSocket && io.sockets && io.sockets.connected) {
        roomSocket = io.sockets.connected[roomUser.id];
      }

      if (roomSocket) {
        try {
          if (typeof roomSocket.disconnect === "function") {
            roomSocket.disconnect(true);
          }
        } catch (e) {
          // ignore
        }
      }
    });

    if (callback) {
      callback();
    }
  });

  socket.on("typing", () => {
    const user = getUser(socket.id);
    if (!user) return;
    socket.broadcast.to(user.room).emit("typing", { userId: socket.id, username: user.username });
  });

  socket.on("stopTyping", () => {
    const user = getUser(socket.id);
    if (!user) return;
    socket.broadcast.to(user.room).emit("stopTyping", { userId: socket.id });
  });
socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      const owner = getRoomOwner(user.room);
      let roomOwner = owner;

      if (owner && owner.ownerId === user.id) {
        roomOwner = assignNextRoomOwner(user.room);
        if (roomOwner) {
          io.to(user.room).emit("message", generateMessage("Admin", `${roomOwner.ownerName} is now the room owner.`));
        }
      }

      io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
        ownerId: roomOwner ? roomOwner.ownerId : null,
        ownerName: roomOwner ? roomOwner.ownerName : null
      });

      // ensure typing indicators are cleared when a user disconnects
      io.to(user.room).emit("stopTyping", { userId: socket.id });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
