const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timezone: { type: String }
  },
  { timestamps: true }
);

LocationSchema.index({ lat: 1, lng: 1 }, { unique: true });

module.exports = mongoose.model('Location', LocationSchema);