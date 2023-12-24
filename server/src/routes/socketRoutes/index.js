const { Server } = require("socket.io");
const handleJoinRoom = require("./joinRoom");
const handleSendMessage = require("./sendMessage");
const handleDisconnect = require("./disconnect");
const server = require("../../../server");

const io = new Server({ ...server, cors: "*" });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new user", (userId) => {
    const existingUser = onlineUsers.find((u) => u.userId === userId);

    if (!existingUser) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
  });

  socket.emit("get online users", onlineUsers);

  socket.on("room", (data) => handleJoinRoom(socket, data));
  socket.on("messages", (data) => handleSendMessage(socket, data));
  socket.on("disconnect", () => {
    // onlineUsers = onlineUsers.filter(u => u.socket ===)
    return handleDisconnect(socket);
  });
});

module.exports = io;
