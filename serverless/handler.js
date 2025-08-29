require('dotenv').config();
const { connectDB } = require('../src/db');
const Location = require('../src/models/Location');
const { ensureFiveDayWindow } = require('../src/services/sunService');

let dbReady;

module.exports.fetchSunDataCron = async () => {
  dbReady = dbReady || connectDB();
  await dbReady;
  const locations = await Location.find().lean();
  for (const loc of locations) {
    await ensureFiveDayWindow(loc);
  }
  return { ok: true, updated: locations.length };
};