const express = require("express");
const {
  getUserByEmail,
  createUser,
  getOrCreateUserByEmail,
  fetchUsers,
} = require("../../controlers/user");

const router = express.Router();

router.get("/:email", getUserByEmail);
router.post("/", createUser);
router.post("/get-or-create-user-by-email/:email", getOrCreateUserByEmail);
router.get("/all", fetchUsers);

module.exports = router;
