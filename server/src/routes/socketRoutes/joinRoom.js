const Room = require("../../models/Room");

function handleJoinRoom(socket, { email, room }) {
  socket.on("createRoom", async ({ roomName }) => {
    // Create a new room and associate it with the creator
    const room = new Room({ name: roomName, users: [socket.user._id] });
    const newRoom = await room.save();

    // Notify everyone about the new room
    io.emit("roomCreated", {
      roomName,
      _id: newRoom._id,
      users: newRoom.users,
    });

    // Join the created room
    socket.join(roomName);

    // Emit event to notify the user about successful room creation
    socket.emit("roomCreated", { roomName });
  });

  socket.on("joinRoom", async ({ roomName }) => {
    // Find the room and add the user to it
    const room = await Room.findOne({ name: roomName });
    if (room) {
      room.users.push(socket.user._id);
      await room.save();

      // Join the room
      socket.join(roomName);

      // Notify everyone in the room that a new user has joined
      io.to(roomName).emit("message", {
        email: "Server",
        text: `${socket.user.email} has joined the room`,
      });

      // Update the user list for everyone in the room
      io.to(roomName).emit("roomData", {
        room: roomName,
        users: room.users.map((userId) => userId.toString()),
      });
    }
  });
}

module.exports = handleJoinRoom;
