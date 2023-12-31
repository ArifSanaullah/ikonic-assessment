const mongoose = require("mongoose");

require("dotenv").config();

const Room = require("../models/Room");
const { createMessage } = require("./message");
const User = require("../models/User");
const Message = require("../models/Message");
const io = require("../routes/socketRoutes");

// Get room with email address
const createRoom = async (req, res) => {
  try {
    const { users, name, createdBy, isPrivate } = req.body;

    if (!users || !name || !createdBy) {
      return res.status(401).send({ message: "Invalid data", success: false });
    }

    const room = new Room({
      users,
      name,
      createdBy,
      isPrivate,
      _id: new mongoose.Types.ObjectId(),
    });

    const roomDoc = await room.save();

    res.status(201).send({
      message: "Room created",
      room: roomDoc.toObject(),
      success: true,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

const getUserRooms = async (req, res) => {
  const { userId } = req.params;

  try {
    const rooms = await Room.find({ createdBy: userId }).exec();

    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

const getJoinedRooms = async (req, res) => {
  const { userId } = req.params;

  try {
    const rooms = await Room.find({ users: userId })
      .populate("createdBy")
      .sort({ createdAt: "desc" })
      .exec();

    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

const getJoinableRooms = async (req, res) => {
  const { userId } = req.params;

  try {
    const joinableRooms = await Room.find({ users: { $ne: userId } }).exec();

    res.status(200).send(joinableRooms);
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

const joinRoom = async (req, res) => {
  const { userId, roomId } = req.body;

  try {
    const room = await Room.findById(roomId).exec();

    if (!room) {
      // Handle the case where the room does not exist
      console.log("Room not found");
    } else {
      // Check if the user is already in the room
      if (room.users.includes(userId)) {
        console.log("User is already in the room");
      } else {
        // Add the user to the room
        room.users.push(userId);

        // Save the updated room to the database
        await room.save();

        const user = await User.findById(userId);

        io.emit("join room", { room, user: user.toObject() });

        res.status(200).send(room);
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

const leaveRoom = async (req, res) => {
  const { userId, roomId } = req.body;

  try {
    const room = await Room.findById(roomId).exec();

    if (!room) {
      // Handle the case where the room does not exist
      console.log("Room not found");
    } else {
      if (room.users.includes(userId)) {
        room.users = room.users.filter((u) => u.toString() !== userId);

        // Save the updated room to the database
        await room.save();

        const user = await User.findById(userId);

        io.emit("leave room", { room, user: user.toObject() });

        res.status(200).send(room);
      } else {
        console.log("User is already in the room");
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  console.log("🚀 ~ file: room.js:131 ~ deleteRoom ~ roomId:", roomId);

  try {
    const room = await Room.findByIdAndDelete(roomId).exec();

    res.status(200).send({ success: true, room });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

module.exports = {
  createRoom,
  getUserRooms,
  getJoinedRooms,
  getJoinableRooms,
  joinRoom,
  leaveRoom,
  deleteRoom,
};
