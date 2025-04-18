const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../database/db");
const { signup, login, googleCallback } = require("../controllers/authController");

const router = express.Router();

// Passport config
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
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

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleCallback);

module.exports = router;
