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

router.get("/pending", (req, res) => {
  db.all("SELECT * FROM bookings WHERE status = 'pending'", [], (err, rows) => {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json(rows);
  });
});


// Update booking status in the database
router.patch("/:id/update", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  // Update the status of the booking
  db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id], function (err) {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json({ message: `Booking status updated to ${status}` });
  });
});
// Delete a booking
router.delete("/:id/delete", (req, res) => {
  const { id } = req.params;

  // Delete the booking
  db.run("DELETE FROM bookings WHERE id = ?", [id], function (err) {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Booking deleted successfully" });
  });
});
// Get all bookings
router.get("/", (req, res) => {
  db.all("SELECT * FROM bookings", [], (err, rows) => {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json(rows);
  });
});
// Get a booking by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM bookings WHERE id = ?", [id], (err, row) => {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      if (!row) {
          return res.status(404).json({ error: "Booking not found" });
      }
      res.json(row);
  });
});
//Checkbox status
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  // Update the status of the booking
  db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id], function (err) {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json({ message: `Booking status updated to ${status}` });
  });
});

// Accept or decline a booking
router.patch("/:id/:action", (req, res) => {
  const { id, action } = req.params;

  // Update the status of the booking
  db.run("UPDATE bookings SET status = ? WHERE id = ?", [action, id], function (err) {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json({ message: `Booking ${action}ed successfully` });
  });
});
module.exports = router;
  