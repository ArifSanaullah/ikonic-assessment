const rooms = {};

function handleDisconnect(socket) {
  console.log("A user disconnected");

  // Find the room the user was in and remove the user
  Object.keys(rooms).forEach((room) => {
    if (rooms[room].users.has(socket.email)) {
      rooms[room].users.delete(socket.email);

      // Notify everyone in the room that a user has left
      socket.to(room).emit("message", {
        email: "Server",
        text: `${socket.email} has left the room`,
      });

      // Update the user list for everyone in the room
      socket.to(room).emit("roomData", {
        room,
        users: Array.from(rooms[room].users),
      });
    }
  });
}

module.exports = handleDisconnect;
