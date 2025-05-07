const db = require("../database/db");

// Update general users profile
exports.updateProfile = (req, res) => {
  const { user_id, name, phone, location } = req.body;

  db.run(
    `UPDATE users SET name = ?, phone = ?, location = ? WHERE id = ?`,
    [name, phone, location, user_id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Profile updated successfully" });
    }
  );
};

// Get general users profile
exports.getProfile = (req, res) => {
  const userId = req.params.userId;

  db.get(
    `SELECT id, name, email, phone, location FROM users WHERE id = ?`,
    [userId],
    (err, row) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(row);
    }
  );
};

// Update service provider profile
exports.updateProviderProfile = (req, res) => {
  const { id, name, email, phone, nid, serviceCategory, experience, service_area, workStart, workEnd } = req.body;

  db.run(
    `UPDATE serviceProviders SET name = ?, phone = ?, email = ?, nid = ?, serviceCategory = ?, experience = ?, serviceArea = ?, workStart = ?, workEnd = ? WHERE id = ?`,
    [name, phone, email, nid, serviceCategory, experience, service_area, workStart, workEnd, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: "Profile updated successfully" });
    }
  );
};

// Get service provider profile
exports.getProviderProfile = (req, res) => {
  const userId = req.user.id;    //Get userId frim the decoded JWT token

  db.get(
    `SELECT name, phone, email, nid, serviceCatagory, experience, service_area, workStart, workEnd FROM serviceProviders WHERE id = ?`,
    [userId],
    (err, row) => {
      if (err) return res.status(400).json({ error: err.message });

      //Check user profile picture exists, otherwise set default image
      const profilePicPath = `/serviceProviders/providerTools/profile/profilePictures/${row.phone}.jpg`;
      res.json({ ...row, profilePicPath });
    }
  );
};
