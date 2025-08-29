// serverless-handlers.js
require('dotenv').config();
const mongoose = require('mongoose');
const Location = require('./src/models/Location');
const { ensureFiveDayWindow } = require('./src/services/sunService');

const MONGODB_URI = process.env.MONGODB_URI;

async function fetchSunDataCron() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected (cronJobs)');

        const locations = await Location.find().lean();
        for (const loc of locations) {
            const updatedData = await ensureFiveDayWindow(loc);
            console.log(`Updated sunlight for ${loc.name}`);
        }

        console.log('Sunlight data updated successfully!');
        await mongoose.disconnect();
        return { status: 'success' };
    } catch (err) {
        console.error('Error in fetchSunDataCron:', err);
        return { status: 'error', message: err.message };
    }
}

module.exports = { fetchSunDataCron };