const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationBtn = document.querySelector("#send-location");
const $leaveRoomBtn = document.querySelector("#leave-room");
const $endRoomBtn = document.querySelector("#end-room");
const $messages = document.querySelector("#messages");
const $typingContainer = document.createElement('div');
const typingTemplate = document.querySelector('#typing-template')?.innerHTML || '';

// insert typing indicators below messages
$typingContainer.id = 'typing-indicators';
$typingContainer.className = 'typing-indicators';
if ($messages && $messages.parentNode) {
  $messages.parentNode.insertBefore($typingContainer, $messages.nextSibling);
}

if ($endRoomBtn) {
  $endRoomBtn.style.display = "none";
}

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("roomHistory", messages => {
  $messages.innerHTML = "";

  if (!Array.isArray(messages) || messages.length === 0) {
    return;
  }

  messages.forEach(message => {
    const messageClass = message.username === username ? 'message--self' : 'message--other';
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a"),
      messageClass
    });
    $messages.insertAdjacentHTML("beforeend", html);
  });
  autoscroll();
});

socket.on("message", message => {
  const messageClass = message.username === username ? 'message--self' : 'message--other';
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
    messageClass
  });

  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", message => {
  const messageClass = message.username === username ? 'message--self' : 'message--other';
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
    messageClass
  });

  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users, ownerId, ownerName }) => {
  // add initials for avatars
  const usersWithInitials = (users || []).map(u => {
    const parts = (u.username || '').split(' ').filter(Boolean);
    const initials = parts.length ? parts.map(p => p[0]).slice(0,2).join('').toUpperCase() : (u.username || '').slice(0,2).toUpperCase();
    return { ...u, initials };
  });

  const html = Mustache.render(sidebarTemplate, {
    room,
    users: usersWithInitials,
    ownerId,
    ownerName
  });

  document.querySelector("#sidebar").innerHTML = html;

  if ($endRoomBtn) {
    $endRoomBtn.style.display = socket.id === ownerId ? "inline-flex" : "none";
  }
});

// track currently typing users (by id)
const typingUsers = new Map();

socket.on('typing', ({ userId, username }) => {
  typingUsers.set(userId, username);
  renderTypingIndicators();
});

socket.on('stopTyping', ({ userId }) => {
  typingUsers.delete(userId);
  renderTypingIndicators();
});

function renderTypingIndicators() {
  const typers = Array.from(typingUsers.entries()).map(([id, username]) => ({ id, username }));
  if (!typingTemplate) {
    // fallback simple
    $typingContainer.innerHTML = typers.map(t => `<div class="typing-item">${t.username} is typing...</div>`).join('');
    return;
  }
  $typingContainer.innerHTML = Mustache.render(typingTemplate, { typers });
}

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    } else {
      console.log("Message delivered!");
    }
  });
  socket.emit('stopTyping');
});

$sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  } else {
    $sendLocationBtn.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition(position => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        error => {
          $sendLocationBtn.removeAttribute("disabled");
          if (!error) {
            console.log("Location shared!");
          }
        }
      );
    });
  }
});

$messageFormInput.addEventListener("input", e => {
  const value = e.target.value.trim();
  if (value.length === 0) {
    socket.emit('stopTyping');
    return;
  }

  socket.emit('typing');
});

$leaveRoomBtn.addEventListener("click", () => {
  if (!confirm("Leave this room?")) {
    return;
  }

  socket.emit("leaveRoom", error => {
    if (error) {
      return alert(error);
    }

    socket.disconnect();
    location.href = "/login";
  });
});

$endRoomBtn.addEventListener("click", () => {
  if (!confirm("End this room for everyone?")) {
    return;
  }

  socket.emit("endRoom", error => {
    if (error) {
      return alert(error);
    }

    // The server will broadcast roomEnded to everyone; this is just a fallback.
    socket.disconnect();
    location.href = "/join";
  });
});

socket.on("roomEnded", data => {
  $messages.innerHTML = "";
  typingUsers.clear();
  renderTypingIndicators();

  alert(data.message || "This room has been ended.");
  socket.disconnect();
  location.href = "/join";
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
