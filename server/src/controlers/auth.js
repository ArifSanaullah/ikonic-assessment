const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

const JWT_KEY = process.env.JWT_KEY;

// Register a new user
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .send({ message: "Email and password is required", success: false });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(422)
        .send({ message: "User already exists", success: false });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        res.status(500).send({ message: err.message, success: false });
      } else {
        const user = new User({
          email,
          password: hash,
          _id: new mongoose.Types.ObjectId(),
        });
        const newUser = await user.save();

        res
          .status(201)
          .send({ message: "User created", user: newUser, success: true });
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(403)
        .send({ message: "Email and password is required", success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .send({ message: "Invalid email or password", success: false });
    }

    const isSame = await bcrypt.compare(password, user.password);

    if (!isSame) {
      return res
        .status(401)
        .send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, JWT_KEY, {
      expiresIn: "1h",
    });

    return res.status(200).send({
      message: "Logged in",
      success: true,
      user: { _id: user._id, email: user.email, token },
    });
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

module.exports = { register, login };
