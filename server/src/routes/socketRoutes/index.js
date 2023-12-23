const { Server } = require("socket.io");
const handleJoinRoom = require("./joinRoom");
const handleSendMessage = require("./sendMessage");
const handleDisconnect = require("./disconnect");
const server = require("../../../server");

const io = new Server({ ...server, cors: "*" });

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("room", (data) => handleJoinRoom(socket, data));
  socket.on("sendMessage", (data) => handleSendMessage(socket, data));
  socket.on("disconnect", () => handleDisconnect(socket));
});

module.exports = io;
