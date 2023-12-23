const Message = require("../models/Message");

// create a message
const createMessage = async (req, res) => {
  try {
    const { recepientId, senderId, text, roomId } = req.body;

    const msg = new Message({ recepientId, senderId, text, roomId });
    const msgDoc = msg.save();

    return res.status(200).json((await msgDoc).toObject());
  } catch (error) {
    res.status(500).send(error);
  }
};

// get messages

const getRoomMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const msgs = await Message.find({ roomId }).exec();

    return res.status(200).send(msgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRecepientMessages = async (req, res) => {
  const { recepientId } = req.params;

  try {
    const msgs = await Message.find({ recepientId }).exec();

    return res.status(200).send(msgs);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createMessage, getRoomMessages, getRecepientMessages };
