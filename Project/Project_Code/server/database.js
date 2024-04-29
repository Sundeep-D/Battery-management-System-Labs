const { MongoClient } = require('mongodb');
const constants = require('./constants'); 
require('dotenv').config();

let client;

async function connect() {
  if (!client) {
    console.log(constants.MongoConnectionString)
    client = new MongoClient(constants.MongoConnectionString);
    await client.connect();
    console.log('MongoDB client connected');
  }
  return client.db(process.env.MONGODB_NAME);
}

async function close() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = { connect, close };
