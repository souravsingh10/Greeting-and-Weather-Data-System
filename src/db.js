const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return mongoose.connection;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartnode';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: uri.split('/').pop() });
  isConnected = true;
  return mongoose.connection;
}

module.exports = { connectDB };