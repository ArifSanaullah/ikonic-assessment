const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      { isAdmin: Boolean, required: true },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
