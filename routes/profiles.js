const express = require("express");
const router = express.Router();
const { updateProfile, getProfile, updateProviderProfile, getProviderProfile } = require("../controllers/profileController");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const path = require("path");


router.put("/update", verifyToken, updateProfile);  // Update profile for general users
router.put("/update-provider", verifyToken, updateProviderProfile);// Update profile for service providers

router.get("/users/:userId", verifyToken, getProfile);// Get profile for general users
router.get("/providers/:userId", verifyToken, getProviderProfile);// Get profile for service providers

// Configure multer to save images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/serviceProviders/providerTools/profile/profilePictures'); // Save the file in this folder
    },
    filename: (req, file, cb) => {
        const phone = req.body.phone; // Use phone number for the file name
        cb(null, `${phone}.jpg`);
    }
});

// Filter to only allow image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 } // Limit file size to 25MB
});

// Profile picture upload route
router.post('/upload-profile-pic', verifyToken, upload.single('profilePic'), (req, res) => {
    try {
        // The file has been uploaded successfully
        const phone = req.body.phone;
        res.json({ success: true, phone: phone });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ success: false, message: 'Error uploading profile picture' });
    }
});


module.exports = router;
