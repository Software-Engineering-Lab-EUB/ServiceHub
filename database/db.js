
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/app.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connected successfully!");
  }
});

// Create Users Table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  phone TEXT,
  location TEXT,
  role TEXT DEFAULT 'user'
)`);

// Create Services Table
db.run(`CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER,
  service_name TEXT,
  category TEXT,
  description TEXT,
  price DECIMAL(10,2),
  availability TEXT
)`);

// Create Bookings Table
db.run(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  service_id INTEGER,
  date TEXT,
  time TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Create Reviews Table
db.run(`CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  service_id INTEGER,
  rating INTEGER,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

module.exports = db;
