const { Server } = require("socket.io");

const io = new Server({ cors: "*" });

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ email, room }) => {
    // Join the specified room
    socket.join(room);

    // Notify everyone in the room that a new user has joined
    socket.to(room).emit("message", {
      email: "Server",
      text: `${email} has joined the room`,
    });

    // Send the message history to the user who just joined
    if (rooms[room] && rooms[room].messages) {
      socket.emit("messageHistory", rooms[room].messages);
    }

    // Save the user to the room
    if (!rooms[room]) {
      rooms[room] = { users: new Set(), messages: [] };
    }
    rooms[room].users.add(email);

    // Update the user list for everyone in the room
    io.to(room).emit("roomData", {
      room,
      users: Array.from(rooms[room].users),
    });
  });

  socket.on("sendMessage", ({ email, room, text }) => {
    // Save the message to the room
    if (rooms[room]) {
      rooms[room].messages.push({ email, text });
      // Keep only the last 10 messages
      rooms[room].messages = rooms[room].messages.slice(-10);
    }

    // Broadcast the message to everyone in the room
    io.to(room).emit("message", { email, text });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");

    // Find the room the user was in and remove the user
    Object.keys(rooms).forEach((room) => {
      if (rooms[room].users.has(socket.email)) {
        rooms[room].users.delete(socket.email);

        // Notify everyone in the room that a user has left
        io.to(room).emit("message", {
          email: "Server",
          text: `${socket.email} has left the room`,
        });

        // Update the user list for everyone in the room
        io.to(room).emit("roomData", {
          room,
          users: Array.from(rooms[room].users),
        });
      }
    });
  });
});

module.exports = io;
