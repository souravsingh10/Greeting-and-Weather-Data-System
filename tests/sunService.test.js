const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Location = require('../src/models/Location');
const SunData = require('../src/models/SunData');
const { ensureFiveDayWindow } = require('../src/services/sunService');

jest.setTimeout(60000);

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

const lat = 28.6139;
const lng = 77.2090;

it('ensures rolling 5-day window', async () => {
  const loc = await Location.create({ name: 'Delhi', lat, lng, timezone: 'Asia/Kolkata' });
  const rows = await ensureFiveDayWindow(loc);
  expect(rows.length).toBe(5);

  const rows2 = await ensureFiveDayWindow(loc);
  expect(rows2.length).toBe(5);

  const one = await SunData.findOne({ locationId: loc._id });
  await SunData.deleteOne({ _id: one._id });
  const rows3 = await ensureFiveDayWindow(loc);
  expect(rows3.length).toBe(5);
});