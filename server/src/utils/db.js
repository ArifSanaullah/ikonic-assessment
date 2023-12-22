const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/chatapp";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;
