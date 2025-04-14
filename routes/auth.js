const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../database/db");
const router = express.Router();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const credentials = JSON.parse(process.env.GOOGLE_OAUTH_SECRETS);
passport.use(new GoogleStrategy({
    clientID: credentials.web.client_id,
    clientSecret: credentials.web.client_secret,
    callbackURL: "/api/auth/google/callback",
    proxy: true
  },
  (accessToken, refreshToken, profile, done) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [profile.emails[0].value], (err, user) => {
      if (err) return done(err);
      if (!user) {
        db.run(`INSERT INTO users (name, email) VALUES (?, ?)`,
          [profile.displayName, profile.emails[0].value],
          function(err) {
            if (err) return done(err);
            return done(null, { id: this.lastID, name: profile.displayName, email: profile.emails[0].value });
          });
      } else {
        return done(null, user);
      }
    });
  }
));

// Signup
router.post("/signup", (req, res) => {
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
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });
    res.json({ token });
  });
});

// Google Auth Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, "secretkey", { expiresIn: "1h" });
    res.redirect(`/?token=${token}`);
  }
);

module.exports = router;
