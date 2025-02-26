const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/app.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Database connected successfully!");
  }
});

// Create Users Table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`
);

// Create Services Table
db.run(
  `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER,
    service_name TEXT,
    category TEXT,
    price INTEGER
  )`
);

module.exports = db;
