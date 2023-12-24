const io = require(".");
const Message = require("../../models/Message");
const Room = require("../../models/Room");

const rooms = {};

function handleSendMessage(socket) {
  socket.on("send message", async ({ recepientId, senderId, text, roomId }) => {
    console.log(
      "🚀 ~ file: sendMessage.js:8 ~ socket.on ~ { recepientId, senderId, text, roomId }:",
      { recepientId, senderId, text, roomId }
    );
    const msg = new Message({ recepientId, senderId, text, roomId });
    const msgDoc = (await msg.save()).populate({
      path: "senderId roomId",
      select: "-password",
    });

    const msgObj = (await msgDoc).toObject();

    socket.emit("new message", {
      message: msgObj,
    });
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
