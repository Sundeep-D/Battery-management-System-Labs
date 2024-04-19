
const { connect, close } = require('./database');
const constants = require('./constants'); 

async function insertData(dataToInsert) {
    dataToInsert.timestamp = constants.getTimestamp();
    dataToInsert.timestamp_human = constants.getTimestampHumanReadableFormat();
  const db = await connect();
  try {
    const result = await db.collection(constants.collection_arduino_raw_data).insertOne(dataToInsert);
    // console.log(`Inserted ${result} document into the collection`);
  } finally {
    await close();
  }
}



module.exports = insertData;
