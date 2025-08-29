const { DateTime } = require('luxon');

function ymd(dt) {
  return dt.toFormat('yyyy-LL-dd');
}

function nextNDatesInZone(n, zone) {
  const start = DateTime.now().setZone(zone).startOf('day');
  return Array.from({ length: n }, (_, i) => ymd(start.plus({ days: i })));
}

module.exports = { ymd, nextNDatesInZone };