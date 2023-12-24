const mongoose = require("mongoose");

require("dotenv").config();

const User = require("../models/User");

// Get user with email address
const createUser = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res
        .status(401)
        .send({ message: "Email is required", success: false });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(422)
        .send({ message: "User already exists", success: false });
    }

    const user = new User({
      email,
      name,
      _id: new mongoose.Types.ObjectId(),
    });

    const userDoc = await user.save();

    res.status(201).send({
      message: "User created",
      user: userDoc.toObject(),
      success: true,
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

// Get user with email address
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res
        .status(403)
        .send({ message: "Email is required", success: false });
    }

    if (email === "all") {
      return fetchUsers(req, res);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .send({ message: "User not found", success: false });
    }

    return res.status(200).send({
      message: "Success",
      success: true,
      user: user.toObject(),
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

// Get user with email address
const getOrCreateUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res
        .status(403)
        .send({ message: "Email is required", success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      const user = new User({
        email,
        _id: new mongoose.Types.ObjectId(),
      });

      const userDoc = await user.save();

      return res.status(201).send({
        message: "User created",
        user: userDoc.toObject(),
        success: true,
      });
    }

    return res.status(200).send({
      message: "Success",
      success: true,
      user: user.toObject(),
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getUserByEmail,
  createUser,
  getOrCreateUserByEmail,
  fetchUsers,
};
