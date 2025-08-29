// src/routes/index.js
const express = require('express');
const router = express.Router();

// Controllers
const { addLocations, listLocations, deleteLocation } = require('../controllers/locationController');
const { getFiveDaySun } = require('../controllers/sunController');
const { getGreeting } = require('../controllers/greetingController'); // For Good morning/afternoon/evening messages

// -------------------
// Location Routes
// -------------------

// Add a single location
router.post('/locations', addLocations);

// Add multiple locations (skip duplicates)
router.post('/locations/batch', async(req, res) => {
    try {
        const locations = req.body.locations;
        if (!Array.isArray(locations) || locations.length === 0) {
            return res.status(400).json({ error: 'locations must be a non-empty array' });
        }

        const inserted = await require('../models/Location').insertMany(
            locations.map(loc => ({
                name: loc.name,
                lat: loc.lat,
                lng: loc.lng,
                timezone: loc.timezone || 'UTC'
            })), { ordered: false } // continue even if duplicates exist
        );

        res.status(201).json(inserted);
    } catch (err) {
        if (err.code === 11000) {
            console.warn('Duplicate detected, skipping duplicates');
            return res.status(201).json({ message: 'Some locations were duplicates and skipped' });
        }
        console.error('Batch route error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// List all locations
router.get('/locations', listLocations);

// Delete a location
router.delete('/locations/:id', deleteLocation);

// -------------------
// Sunlight Routes
// -------------------

// Get 5-day sunrise/sunset for a location
router.get('/locations/:id/sunlight', getFiveDaySun);

// -------------------
// Greeting Routes
// -------------------

// Get personalized greeting based on local time
router.get('/locations/:id/greeting', getGreeting);

// Export the router
module.exports = router;