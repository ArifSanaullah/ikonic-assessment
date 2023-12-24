const Message = require("../models/Message");
const io = require("../routes/socketRoutes");

// create a message
const createMessage = async (req, res) => {
  try {
    const { recepientId, senderId, text, roomId } = req.body;

    const msg = new Message({ recepientId, senderId, text, roomId });
    const msgDoc = (await msg.save()).populate({
      path: "senderId roomId",
      select: "-password",
    });

    const msgObj = (await msgDoc).toObject();

    io.emit("new message", {
      message: msgObj,
    });

    return res.status(200).json((await msgDoc).toObject());
  } catch (error) {
    console.log("🚀 ~ file: message.js:20 ~ createMessage ~ error:", error);
    res.status(500).send(error);
  }
};

// get messages

const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const msgs = await Message.find({ roomId })
      .populate({ path: "senderId", select: "-password" })
      .exec();

    return res.status(200).send(msgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRecepientMessages = async (req, res) => {
  const { recepientId } = req.params;

  try {
    const msgs = await Message.find({ recepientId })
      .populate({ path: "senderId", select: "-password" })
      .exec();

    return res.status(200).send(msgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createMessage, getRoomMessages, getRecepientMessages };
