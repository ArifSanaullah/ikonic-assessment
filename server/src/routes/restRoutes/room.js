const express = require("express");
const {
  createRoom,
  getUserRooms,
  getJoinedRooms,
  getJoinableRooms,
  joinRoom,
  leaveRoom,
  deleteRoom,
} = require("../../controlers/room");

const router = express.Router();

router.post("/", createRoom);
router.get("/get-joinable-rooms/:userId", getJoinableRooms);
router.get("/user/:userId", getUserRooms);
router.get("/joined/:userId", getJoinedRooms);
router.patch("/join-room", joinRoom);
router.patch("/leave-room", leaveRoom);
router.delete("/delete/:roomId", deleteRoom);


module.exports = router;
