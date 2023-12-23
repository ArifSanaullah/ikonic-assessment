const { Server } = require("socket.io");
const handleJoinRoom = require("./joinRoom");
const handleSendMessage = require("./sendMessage");
const handleDisconnect = require("./disconnect");

const io = new Server({ cors: "*" });

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (data) => handleJoinRoom(socket, data));
  socket.on("sendMessage", (data) => handleSendMessage(socket, data));
  socket.on("disconnect", () => handleDisconnect(socket));
});

module.exports = io;
