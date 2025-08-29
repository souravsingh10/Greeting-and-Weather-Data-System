const mongoose = require('mongoose');

const SunDataSchema = new mongoose.Schema(
  {
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    date: { type: String, required: true },
    sunrise: { type: Date, required: true },
    sunset: { type: Date, required: true }
  },
  { timestamps: true }
);

SunDataSchema.index({ locationId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SunData', SunDataSchema);