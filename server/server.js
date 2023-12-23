const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const io = require("./src/routes/socketRoutes");

const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
const SOCKET_PORT = process.env.SOCKET_PORT || 3002;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/chatapp";

mongoose.connect(MONGODB_URI, {});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    io.listen(SOCKET_PORT);
  });
});

module.exports = server;
