
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

async function getSocVoltageDataForChart() {
  return {
    labels: ["a", "b", "c", "d", "Aug", "Sep", "Oct", "Nov", "Dec","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Voltage",
        color: "info",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500,50, 40, 300, 220, 500, 250, 400, 230, 500],
      },
      {
        label: "SOC",
        color: "dark",
        data: [30, 90, 40, 140, 290, 290, 340, 230, 400,30, 90, 40, 140, 290, 290, 340, 230, 400],
      },
    ],
  };
}


module.exports = {
  insertData,
  getSocVoltageDataForChart
};
