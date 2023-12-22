const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./src/routes/restRoutes/auth");
const userRoutes = require("./src/routes/restRoutes/user");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.get("/health", (req, res) => {
  res
    .status(200)
    .send({ message: "Server is running.", status: 200, success: true });
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = app;
