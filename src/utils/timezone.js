const tzLookup = require('tz-lookup');
const { DateTime } = require('luxon');

function tzFor(lat, lng) {
  try {
    return tzLookup(lat, lng);
  } catch (e) {
    return 'UTC';
  }
}

function greetingForHour(hour) {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function nowInZone(zone) {
  return DateTime.now().setZone(zone);
}

module.exports = { tzFor, greetingForHour, nowInZone };