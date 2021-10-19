
const mongoose = require('mongoose');

// enable environment variables
require('dotenv').config();

const connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(m => m.connection.getClient());

// handle errors while connection is active
// mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));

module.exports = connectionPromise;