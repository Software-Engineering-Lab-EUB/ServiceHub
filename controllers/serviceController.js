const db = require("../database/db");

// Add a new service
exports.addService = (req, res) => {
  const { provider_id, service_name, category, price } = req.body;

  db.run(
    `INSERT INTO services (provider_id, service_name, category, price) VALUES (?, ?, ?, ?)`,
    [provider_id, service_name, category, price],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Service added!" });
    }
  );
};

// Get all services
exports.getAllServices = (req, res) => {
  db.all(`SELECT * FROM services`, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
};
