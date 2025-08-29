const axios = require('axios');
const SunData = require('../models/SunData');
const { nextNDatesInZone } = require('../utils/dates');

const SUN_API_BASE = process.env.SUN_API_BASE || 'https://api.sunrise-sunset.org/json';

async function fetchSunForDate(lat, lng, date) {
  const url = `${SUN_API_BASE}?lat=${lat}&lng=${lng}&date=${date}&formatted=0`;
  const { data } = await axios.get(url);
  if (!data || data.status !== 'OK') throw new Error(`Sun API failed for ${date}`);
  const { sunrise, sunset } = data.results;
  return { sunrise: new Date(sunrise), sunset: new Date(sunset) };
}

async function ensureFiveDayWindow(location) {
  const { _id: locationId, lat, lng, timezone } = location;
  const targetDates = new Set(nextNDatesInZone(5, timezone));

  const existing = await SunData.find({ locationId }).lean();
  const existingByDate = new Map(existing.map((d) => [d.date, d]));

  const toFetch = [];
  for (const d of targetDates) {
    if (!existingByDate.has(d)) toFetch.push(d);
  }

  if (toFetch.length) {
    const fetched = await Promise.all(
      toFetch.map(async (d) => {
        const r = await fetchSunForDate(lat, lng, d);
        return {
          insertOne: {
            document: { locationId, date: d, sunrise: r.sunrise, sunset: r.sunset }
          }
        };
      })
    );
    if (fetched.length) await SunData.bulkWrite(fetched);
  }

  await SunData.deleteMany({ locationId, date: { $nin: Array.from(targetDates) } });

  return SunData.find({ locationId, date: { $in: Array.from(targetDates) } })
    .sort({ date: 1 })
    .lean();
}

module.exports = { ensureFiveDayWindow, fetchSunForDate };