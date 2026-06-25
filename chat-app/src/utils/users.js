const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }

  // Check for existing user in the same room
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  let reconnecting = false;

  if (existingUser) {
    if (existingUser.id === id) {
      return {
        error: "Username is in use!"
      };
    }

    // If the same username is already in the room, treat this as a reconnect
    // and remove the stale user entry so the refresh restores the same room.
    reconnecting = true;
    users.splice(users.indexOf(existingUser), 1);
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user, reconnecting };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
  room = room.trim().toLowerCase();
  return users.filter(user => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
