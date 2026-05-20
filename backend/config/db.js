const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  if (isConnected) {
    return mongoose.connection;
  }

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  isConnected = true;
  return mongoose.connection;
}

module.exports = { connectToDatabase };
