const express = require("express");
const router = express.Router();
const { updateProfile, getProfile } = require("../controllers/profileController");

// Update profile
router.put("/update", updateProfile);

// Get profile
router.get("/:userId", getProfile);

module.exports = router;
