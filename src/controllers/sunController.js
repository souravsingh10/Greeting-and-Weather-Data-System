const Location = require('../models/Location');
const { ensureFiveDayWindow } = require('../services/sunService');

async function getFiveDaySun(req, res) {
  const { id } = req.params;
  const loc = await Location.findById(id);
  if (!loc) return res.status(404).json({ error: 'Location not found' });

  const rows = await ensureFiveDayWindow(loc);
  res.json({ location: { id: loc._id, name: loc.name, lat: loc.lat, lng: loc.lng, timezone: loc.timezone }, days: rows });
}

module.exports = { getFiveDaySun };