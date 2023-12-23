const express = require("express");
const {
  createMessage,
  getRecepientMessages,
  getRoomMessages,
} = require("../../controlers/message");

const router = express.Router();

router.post("/", createMessage);
router.get("/recepient/:recepeintId", getRecepientMessages);
router.get("/room/:roomId", getRoomMessages);

module.exports = router;
