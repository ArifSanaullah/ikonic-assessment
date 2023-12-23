const Room = require("../../models/Room");

const rooms = {};

function handleSendMessage(socket, { email, room, text }) {
  // Save the message to the room
  // if (rooms[room]) {
  //   rooms[room].messages.push({ email, text });
  //   // Keep only the last 10 messages
  //   rooms[room].messages = rooms[room].messages.slice(-10);
  // }

  // // Broadcast the message to everyone in the room
  // socket.to(room).emit("message", { email, text });

  socket.on("sendMessage", async ({ roomName, text, recipient }) => {
    // Save the message to the room
    const room = await Room.findById({ name: roomName });
    if (room) {
      room.messages.push({
        sender: socket.user._id,
        text,
        recipient,
      });
      await room.save();

      // Broadcast the message to everyone in the room
      io.to(roomName).emit("message", {
        email: socket.user.email,
        text,
        recipient,
      });
    }
  });

  socket.on("privateMessage", async ({ recipient, text }) => {
    // Find the recipient user
    const recipientUser = await User.findOne({ email: recipient });
    if (recipientUser) {
      // Save the private message
      const privateMessage = new PrivateMessage({
        sender: socket.user._id,
        recipient: recipientUser._id,
        text,
      });
      await privateMessage.save();

      // Emit the private message event to the sender and recipient
      io.to(socket.id).emit("privateMessage", {
        email: socket.user.email,
        text,
      });
      io.to(recipientUser.email).emit("privateMessage", {
        email: socket.user.email,
        text,
      });
    }
  });
}

module.exports = handleSendMessage;
