// src/cronJobs.js
const mongoose = require('mongoose');
const cron = require('node-cron');
const Location = require('./models/Location');
const { ensureFiveDayWindow } = require('./services/sunService'); // <-- updated path

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect('mongodb://localhost:27017/smartnode');
        console.log('MongoDB connected (cronJobs)');
    }
}

async function updateAllLocationsSunlight() {
    await connectDB();
    const locations = await Location.find();
    for (const loc of locations) {
        await ensureFiveDayWindow(loc);
        console.log(`Updated sunlight for ${loc.name}`);
    }
}

// Daily cron job at midnight
cron.schedule('0 0 * * *', async() => {
    console.log('Running daily sunlight update...');
    await updateAllLocationsSunlight();
});

// Export the manual trigger function
module.exports = { updateAllLocationsSunlight };