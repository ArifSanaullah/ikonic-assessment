const express = require("express");
const {
  getUserByEmail,
  createUser,
  getOrCreateUserByEmail,
} = require("../../controlers/user");

const router = express.Router();

router.get("/:email", getUserByEmail);
router.post("/", createUser);
router.post("/get-or-create-user-by-email/:email", getOrCreateUserByEmail);

module.exports = router;
