const Location = require('../models/Location');
const { tzFor, greetingForHour, nowInZone } = require('../utils/timezone');

// Add one or multiple locations
async function addLocations(req, res) {
    const payload = Array.isArray(req.body.locations) ? req.body.locations : [req.body];
    const docs = [];
    for (const loc of payload) {
        const { name, lat, lng } = loc;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            return res.status(400).json({ error: 'lat and lng must be numbers' });
        }
        const timezone = tzFor(lat, lng);
        try {
            const created = await Location.findOneAndUpdate({ lat, lng }, { name: name || null, lat, lng, timezone }, { upsert: true, new: true, setDefaultsOnInsert: true });
            docs.push(created);
        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }
    return res.status(201).json({ locations: docs });
}

// List all locations
async function listLocations(req, res) {
    const items = await Location.find().sort({ createdAt: -1 }).lean();
    res.json({ locations: items });
}

// Greeting based on local time
async function greeting(req, res) {
    const { id } = req.params;
    const loc = await Location.findById(id).lean();
    if (!loc) return res.status(404).json({ error: 'Location not found' });
    const dt = nowInZone(loc.timezone);
    const msg = greetingForHour(dt.hour);
    res.json({ message: `${msg}!`, localTime: dt.toISO(), timezone: loc.timezone });
}

// Delete a location
async function deleteLocation(req, res) {
    const { id } = req.params;
    const deleted = await Location.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: `Location ${deleted.name} deleted successfully` });
}

module.exports = { addLocations, listLocations, greeting, deleteLocation };