const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

// Handle user signup
exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "User registered!" });
    }
  );
};

// Handle user login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });
    res.json({ token });
  });
};

// Handle Google Auth callback
exports.googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user.id }, "secretkey", { expiresIn: "1h" });
  res.redirect(`/?token=${token}`);
};

// Handle service provider signup
exports.serviceProviderSignup = (req, res) => {
  const { name, email, password, phone, dob, nid, serviceCategory, experience, service_area, workStart, workEnd, workingDays } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
      `INSERT INTO serviceProviders (name, email, password, phone, dob, nid, serviceCategory, experience, service_area, workStart, workEnd, workingDays) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone, dob, nid, serviceCategory, experience, service_area, workStart, workEnd, workingDays],
      function (err) {
          if (err) return res.status(400).json({ error: err.message });
          res.json({ message: "Service provider registered successfully!" });
      }
  );
};

//Handle service Provider login
exports.serviceProviderLogin = (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM serviceProviders WHERE email = ?`, [email], (err, provider) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });  // Provide a meaningful error message
    }

    if (!provider) {
      return res.status(401).json({ error: "Provider not found" });  // If provider is not found
    }

    if (!bcrypt.compareSync(password, provider.password)) {
      return res.status(401).json({ error: "Invalid credentials" });  // If password is incorrect
    }

    // Generate token and send the response
    const token = jwt.sign({ id: provider.id }, "secretkey", { expiresIn: "3h" });
    res.json({ token });  // Return the token if login is successful
  });
};


