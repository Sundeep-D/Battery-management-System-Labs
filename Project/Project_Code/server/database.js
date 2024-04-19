const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
// Database Name
const dbName = 'skybms';

let client;

async function connect() {
  if (!client) {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
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
