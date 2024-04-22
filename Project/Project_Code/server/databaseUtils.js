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

    if (documents.length === 0) {
      console.log("No documents found in the past 1 hour");
      return {
        labels: [],
        datasets: [
          {
            label: "--",
            color: "info",
            data: [],
          },
          {
            label: "--",
            color: "dark",
            data: [],
          },
        ],
      };
    }

    // Initialize an object to store documents in 3-minute intervals
    const segregatedData = {};

    // Define the interval duration (in milliseconds)
    const intervalDuration = 3 * 60 * 1000;

    // Iterate over documents and group them by interval
    documents.forEach(doc => {
      const timestamp = doc.timestamp.getTime();
      const intervalStart = Math.floor(timestamp / intervalDuration) * intervalDuration;
      if (!segregatedData[intervalStart]) {
        segregatedData[intervalStart] = [];
      }
      segregatedData[intervalStart].push(doc);
    });

    // Now, segregatedData contains documents grouped by 3-minute intervals

    // Initialize an object to store one document from each interval
    const pickedDocuments = {};

    // Iterate over each interval and pick one document
    for (const intervalStart in segregatedData) {
      if (segregatedData.hasOwnProperty(intervalStart)) {
        pickedDocuments[intervalStart] = segregatedData[intervalStart][0]; // Pick the first document in each interval
      }
    }

    return feedDataIntoJson(pickedDocuments);
    // Now, pickedDocuments contains one document from each 3-minute interval
    // console.log("One document picked from each 3-minute interval:", JSON.stringify(feedDataIntoJson(pickedDocuments)));

    // You can return or process the pickedDocuments further as needed

  } catch (error) {
    console.log("Error occurred while fetching documents:", error);
    return null;
  }
}

function feedDataIntoJson(pickedDocuments) {
  const labels = new Array(20).fill(0);
  const socData = new Array(20).fill(0);
  const voltageData = new Array(20).fill(0);

  const numDocuments = Object.keys(pickedDocuments).length;
  let startIndex = Math.max(0, 20 - numDocuments); // Calculate the starting index to fill documents

  for (let i = startIndex; i < 20; i++) {
    if (i === 19) {
      labels[i] = "Now";
    } else if (i < 20) {
      tmp = 20 - i;
      labels[i] = tmp*3+"m";
    }
  }

  for (const timestamp in pickedDocuments) {
    if (pickedDocuments.hasOwnProperty(timestamp)) {
      const doc = pickedDocuments[timestamp];
      // labels[startIndex] = doc.timestamp;
      socData[startIndex] = doc.soc;
      voltageData[startIndex] = doc.voltage;
      startIndex++;
    }
  }

  const jsonData = {
    labels: labels,
    datasets: [
      {
        label: "SOC",
        color: "info",
        data: socData,
      },
      // {
      //   label: "Voltage",
      //   color: "dark",
      //   data: voltageData,
      // },
    ],
  };

  return jsonData;
}



module.exports = {
  insertData,
  getSocVoltageDataForChart,
  connectToDb,
  db // Export the db variable for future use
};
