const express = require("express");
const db = require("../database/db");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
} = require("../controllers/bookingController");

// POST: Create a booking
router.post("/create", createBooking);

// GET: Get bookings by contact number (if needed)
router.get("/user/:contactNumber", getUserBookings);

module.exports = router;
  