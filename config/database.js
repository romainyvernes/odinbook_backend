
const mongoose = require('mongoose');

// enable environment variables
require('dotenv').config();

const connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(m => m.connection.getClient()).catch((err) => console.error(err));

module.exports = connectionPromise;