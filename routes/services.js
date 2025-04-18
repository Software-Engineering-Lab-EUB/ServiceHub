const express = require("express");
const router = express.Router();
const db = require('../database/db');
const { addService, getAllServices } = require("../controllers/serviceController");

// Add a new service
router.post('/register-provider', (req, res) => {
    const { name, serviceCatagory, experience, serviceArea } = req.body;

    // Validation error (user input missing)
    if (!name || !serviceCatagory || !experience || !serviceArea) {
        return res.status(400).send(`
            <div style="padding: 20px; max-width: 500px; margin: 50px auto; border: 1px solid #f44336; background-color: #ffe6e6; font-family: Arial, sans-serif; border-radius: 8px;">
                <h2 style="color: #f44336;">⚠️ Error: Incomplete Submission</h2>
                <p>Please fill out <strong>all fields</strong> to complete your registration.</p>
                <a href="/" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px;">Back to Home</a>
            </div>
        `);
    }

    const insertQuery = `INSERT INTO serviceProviders (name, serviceCatagory, experience, serviceArea)
    VALUES (?, ?, ?, ?) `;

    db.run(insertQuery, [name, serviceCatagory, experience, serviceArea], function (err) {
        if (err) {
            console.error('Error inserting data: ', err.message);
            return res.status(500).send(`
                <div style="padding: 20px; max-width: 500px; margin: 50px auto; border: 1px solid #ff9800; background-color: #fff3e0; font-family: Arial, sans-serif; border-radius: 8px;">
                    <h2 style="color: #ff9800;">🚨 Server Error</h2>
                    <p>Oops! Something went wrong on our end. Please try again later.</p>
                    <a href="/" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #ff9800; color: white; text-decoration: none; border-radius: 4px;">Back to Home</a>
                </div>
            `);
        }

        // Success message
        res.send(`
            <div style="padding: 20px; max-width: 500px; margin: 50px auto; border: 1px solid #4CAF50; background-color: #e8f5e9; font-family: Arial, sans-serif; border-radius: 8px;">
                <h2 style="color: #4CAF50;">🎉 Thank You, ${name}!</h2>
                <p>Your registration as a service provider was <strong>successful</strong>.</p>
                <a href="/" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Back to Home</a>
            </div>
        `);
    });
});

// Get all services
router.get("/all", getAllServices);

module.exports = router;
