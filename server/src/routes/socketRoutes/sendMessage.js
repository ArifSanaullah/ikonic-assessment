const io = require(".");
const Message = require("../../models/Message");
const Room = require("../../models/Room");

const rooms = {};

function handleSendMessage(socket) {
  socket.on("send message", async ({ recepientId, senderId, text, roomId }) => {
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
}

module.exports = handleSendMessage;
