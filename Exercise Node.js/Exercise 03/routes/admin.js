
const express = require("express");
const router = express.Router();

const protect = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// Admin Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      message: `Welcome Admin ${req.user.name}`,
      role: req.user.role
    });
  }
);

module.exports = router;
