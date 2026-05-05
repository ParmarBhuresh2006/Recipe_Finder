require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000
    });
    console.log('Connected');
    mongoose.connection.close();
  } catch(e) {
    fs.writeFileSync('error_log.txt', String(e.stack));
  }
}
testConnection();
