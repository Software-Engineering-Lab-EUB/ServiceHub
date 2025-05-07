const db = require("../database/db");

// Create a new booking
exports.createBooking = (req, res) => {
  console.log("Receive booking data: ", req.body);

  const {
    user_name,
    contact_number,
    email,
    service_address,
    date,
    time,
    work_details,
    status = "pending",
  } = req.body;

  // Validate inputs (server-side)
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^01[3-9][0-9]{8}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameRegex.test(user_name)) {
    return res.status(400).json({ error: "Invalid name format." });
  }

  if (!phoneRegex.test(contact_number)) {
    return res.status(400).json({ error: "Invalid Bangladeshi phone number." });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const currentDate = new Date().toISOString().split("T")[0];
  if (date < currentDate) {
    return res.status(400).json({ error: "Service date cannot be in the past." });
  }

  db.run(
    `INSERT INTO bookings (
        user_name, contact_number, email, service_address,
        date, time, work_details, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_name,
      contact_number,
      email,
      service_address,
      date,
      time,
      work_details,
      status,
    ],
    function (err) {
      if (err){
        console.error("Insert error: ", err.message);
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Booking created successfully" });
    }
  );
};

// (Optional) Get bookings by phone/email/etc. – if needed
exports.getUserBookings = (req, res) => {
  const contactNumber = req.params.contactNumber;

  db.all(
    `SELECT * FROM bookings WHERE contact_number = ?`,
    [contactNumber],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    }
  );
};
// Get all pending bookings
exports.getPendingBookings = (req, res) => {
  db.all(
    "SELECT * FROM bookings WHERE status = 'pending'",
    [],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows);
    }
  );
};
// Update booking status
exports.updateBookingStatus = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  // Update the status of the booking in the database
  db.run("UPDATE bookings SET status = ? WHERE id = ?", [status, id], function (err) {
      if (err) {
          return res.status(400).json({ error: err.message });
      }
      res.json({ message: `Booking status updated to ${status}` });
  });
};
// Accept or decline a booking
exports.acceptOrDeclineBooking = (req, res) => {
  const { id, action } = req.params;

  // Update the status of the booking
  db.run(
    "UPDATE bookings SET status = ? WHERE id = ?",
    [action, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: `Booking ${action}ed successfully` });
    }
  );
};
// Get all bookings
exports.getAllBookings = (req, res) => {
  db.all("SELECT * FROM bookings", [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
};
// Get booking by ID
exports.getBookingById = (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM bookings WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row);
  });
};
// Delete booking by ID
exports.deleteBookingById = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM bookings WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Booking deleted successfully" });
  });
}
//checkbox status
exports.updateBookingCheckboxStatus = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  // Update the status of the booking
  db.run(
    "UPDATE bookings SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: `Booking status updated to ${status}` });
    }
  );
};