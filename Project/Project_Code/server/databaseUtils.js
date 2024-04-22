const { connect, close } = require('./database');
const constants = require('./constants');

let db = null;

async function connectToDb() {
  db = await connect();
}

async function insertData(dataToInsert) {
  if (!db) {
    await connectToDb();
  }

  dataToInsert.timestamp = constants.getTimestamp();
  dataToInsert.timestamp_human = constants.getTimestampHumanReadableFormat();

  try {
    const result = await db.collection(constants.collection_arduino_raw_data).insertOne(dataToInsert);
    // console.log(`Inserted ${result} document into the collection`);
  } catch (error) {
    console.log("Error occurred while inserting data:", error);
  }
}

async function getSocVoltageDataForChart() {
  if (!db) {
    await connectToDb();
  }

  const collection = db.collection(constants.collection_arduino_raw_data);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const query = { timestamp: { $gt: oneHourAgo } };
  const projection = { _id: 0, voltage: 1, soc: 1, timestamp: 1 };

  try {
    const documents = await collection.find(query, { projection }).sort({ timestamp: 1 }).toArray();
    console.log(JSON.stringify(documents));

    if (documents.length === 0) {
      console.log("No documents found in the past 1 hour");
      return null;
    }

    // Calculate the time interval (in milliseconds) between each document
    const interval = 3 * 60 * 1000; // 3 minutes in milliseconds

    // Calculate the number of documents needed
    const numDocumentsNeeded = 20;

    // Initialize arrays to store timestamps, voltages, and SOCs
    const labels = [];
    const voltageData = [];
    const socData = [];

    // Start time for selecting documents
    let startTime = Date.now() - 60 * 60 * 1000; // 1 hour ago
    console.log(startTime);

    // Iterate over each 3-minute interval
    for (let i = 0; i < numDocumentsNeeded - 1; i++) {
      // Find the document closest to the current time interval
      const closestDocument = documents.find(doc => Math.abs(doc.timestamp.getTime() - startTime) < interval);
      if (closestDocument) {
        // Store timestamp
        labels.push(constants.getFormattedTimestamp(closestDocument.timestamp));
        // Store voltage
        voltageData.push(closestDocument.voltage);
        // Store SOC
        socData.push(closestDocument.soc);
      } else {
        // If no document found for this interval, fill with placeholders
        labels.push("-");
        voltageData.push("-");
        socData.push("-");
      }
      // Move to the next time interval
      startTime += interval;
    }

    // Check if the last interval has data, if yes, include it in the dataset
    const lastDocument = documents[documents.length - 1];
    if (lastDocument) {
      labels.push(constants.getFormattedTimestamp(lastDocument.timestamp));
      voltageData.push(lastDocument.voltage);
      socData.push(lastDocument.soc);
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Voltage",
          color: "info",
          data: voltageData,
        },
        {
          label: "SOC",
          color: "dark",
          data: socData,
        }
      ],
    };
  } catch (error) {
    console.log("Error occurred while fetching documents:", error);
    return null;
  }
}


module.exports = {
  insertData,
  getSocVoltageDataForChart,
  connectToDb,
  db // Export the db variable for future use
};
