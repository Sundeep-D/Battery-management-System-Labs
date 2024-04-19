
const { connect, close } = require('./database');

async function insertData(dataToInsert) {
    dataToInsert.timestamp = new Date();
  const db = await connect();
  try {
    const result = await db.collection('arduino_data').insertOne(dataToInsert);
    console.log(`Inserted ${result.insertedCount} document into the collection`);
  } finally {
    await close();
  }
}

module.exports = insertData;
