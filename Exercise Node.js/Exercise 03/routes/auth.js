
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  profile
} = require("../controllers/authController");

const protect = require("../middlewares/auth");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected Profile
router.get("/profile", protect, profile);

module.exports = router;
