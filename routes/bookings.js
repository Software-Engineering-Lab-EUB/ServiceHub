
const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Create booking
router.post("/create", (req, res) => {
  const { user_id, service_id, date, time, status = "pending" } = req.body;
  
  db.run(
    `INSERT INTO bookings (user_id, service_id, date, time, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, service_id, date, time, status],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Booking created successfully" });
    }
  );
});

// Get user bookings
router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  
  db.all(
    `SELECT b.*, s.service_name, s.price 
     FROM bookings b 
     JOIN services s ON b.service_id = s.id 
     WHERE b.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    }
  );
});

module.exports = router;
