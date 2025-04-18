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
