const { Server } = require("socket.io");
const handleJoinRoom = require("./joinRoom");
const handleSendMessage = require("./sendMessage");
const handleDisconnect = require("./disconnect");
const server = require("../../../server");

const io = new Server({ ...server, cors: "*" });

const onlineUsers = [];
let typingUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new user", (userId) => {
    const existingUser = onlineUsers.find((u) => u.userId === userId);

    if (!existingUser) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
  });

  socket.emit("get online users", onlineUsers);

  socket.on("typing start", ({ room, user }) => {
    console.log("🚀 ~ file: index.js:36 ~ socket.on ~ { room, user }:", {
      room,
      user,
    });

    const existingUser = typingUsers.find(
      (u) => u.userId === user.id && room._id === u.roomId
    );
    if (!existingUser) {
      typingUsers.push({ userId: user.id, roomId: room._id });
      io.emit("get typing users", typingUsers);
    }
  });

  socket.on("typing end", ({ room, user }) => {
    typingUsers = typingUsers.filter(
      (u) => !(u.userId === user.id && room._id === u.roomId)
    );

    io.emit("get typing users", typingUsers);
  });

  socket.on("room", (data) => handleJoinRoom(socket, data));
  socket.on("messages", (data) => handleSendMessage(socket, data));
  socket.on("disconnect", () => {
    return handleDisconnect(socket);
  });
});

module.exports = io;
