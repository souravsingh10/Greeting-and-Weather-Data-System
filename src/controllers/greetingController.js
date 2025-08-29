const Location = require('../models/Location');
const { getLocationGreeting } = require('../services/greetingService');

async function getGreeting(req, res) {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) return res.status(404).json({ error: 'Location not found' });

    const greeting = await getLocationGreeting(location);
    res.json({ message: greeting });
}

module.exports = { getGreeting };