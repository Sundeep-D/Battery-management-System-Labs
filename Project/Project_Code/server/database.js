const { MongoClient } = require('mongodb');
const constants = require('./constants'); 


let client;

async function connect() {
  if (!client) {
    client = new MongoClient(constants.MongoConnectionString, { useUnifiedTopology: true });
    await client.connect();
    console.log('MongoDB client connected');
  }
  return client.db(dbName);
}

async function close() {
  if (client) {
    await client.close();
    client = null;
  }
}

module.exports = { connect, close };
