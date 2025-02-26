
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Import Routes
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services");
const bookingRoutes = require("./routes/bookings");
const profileRoutes = require("./routes/profiles");

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/profiles", profileRoutes);

// Serve static files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
