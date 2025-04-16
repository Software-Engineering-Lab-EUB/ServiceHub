const express = require("express");
const db = require("../database/db");
const router = express.Router();

// Add Service
router.post("/add", (req, res) => {
  const { provider_id, service_name, category, price } = req.body;

  db.run(
    `INSERT INTO services (provider_id, service_name, category, price) VALUES (?, ?, ?, ?)`,
    [provider_id, service_name, category, price],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Service added!" });
    }
  );
});

// Get Services
router.get("/all", (req, res) => {
  db.all(`SELECT * FROM services`, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
