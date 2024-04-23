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
    console.log(`Inserted!`);
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

      jsonObject = {};
      jsonObject.socChartData = {
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
      }

      jsonObject.voltageChartData = {
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
      }
      return jsonObject;
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

    // console.log(JSON.stringify(segregatedData));

    // Now, segregatedData contains documents grouped by 3-minute intervals

    // Initialize an object to store one document from each interval
    const pickedDocuments = {};

    // Iterate over each interval and pick the last document
    for (const intervalStart in segregatedData) {
      if (segregatedData.hasOwnProperty(intervalStart)) {
        const documentsInInterval = segregatedData[intervalStart];
        const lastDocumentIndex = documentsInInterval.length - 1;
        pickedDocuments[intervalStart] = documentsInInterval[lastDocumentIndex]; // Pick the last document in each interval
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
      labels[i] = tmp * 3 + "m";
    }
  }

  for (const timestamp in pickedDocuments) {
    if (pickedDocuments.hasOwnProperty(timestamp)) {
      const doc = pickedDocuments[timestamp];
      // labels[startIndex] = doc.timestamp;
      if (doc.soc) {
        socData[startIndex] = doc.soc;
      } else if (socData[startIndex - 1]) {
        socData[startIndex] = socData[startIndex - 1];
      } else {
        socData[startIndex] = 0;
      }

      voltageData[startIndex] = doc.voltage;
      startIndex++;
    }
  }

  const socJsonData = {
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


  const voltageJsonData = {
    labels: socData.map(value => Math.round(value)),
    datasets: [
      {
        label: "Voltage",
        color: "dark",
        data: voltageData,
      }
    ],
  };

  // console.log(findIncreaseOrDecrease(socData));
  socJsonData.stat = findIncreaseOrDecrease(socData);
  voltageJsonData.avg = findVoltageAverage(voltageData);

  jsonResult = {};
  jsonResult.socChartData = socJsonData
  jsonResult.voltageChartData = voltageJsonData
  return jsonResult;
}

function findVoltageAverage(voltageData) {
  // Filter out zeros from voltageData
  const nonZeroVoltages = voltageData.filter(val => val !== 0);

  // Check if there are non-zero voltages in the array
  if (nonZeroVoltages.length === 0) {
      return 0; // Return 0 if all values are zero
  }

  // Calculate sum of non-zero voltages
  const sum = nonZeroVoltages.reduce((acc, val) => acc + val, 0);

  // Calculate average
  const average = sum / nonZeroVoltages.length;

  return average;
}

function findIncreaseOrDecrease(socData) {
  const halfIndex = Math.floor(socData.length / 2);

  // Calculate the sum of the first half of the data
  const sumFirstHalf = socData.slice(0, halfIndex).reduce((acc, val) => acc + val, 0);

  // Calculate the sum of the second half of the data
  const sumSecondHalf = socData.slice(halfIndex).reduce((acc, val) => acc + val, 0);

  // Calculate the average of the first half
  const averageFirstHalf = sumFirstHalf / halfIndex;

  // Calculate the average of the second half
  const averageSecondHalf = sumSecondHalf / (socData.length - halfIndex);

  // Calculate the difference between the averages
  const difference = averageSecondHalf - averageFirstHalf;

  return difference;
}


async function deleteOldDocuments() {
  if (!db) {
    await connectToDb();
  }

  const collection = db.collection(constants.collection_arduino_raw_data);
  const tenHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
  const query = { timestamp: { $lt: tenHoursAgo } };

  try {
    const result = await collection.deleteMany(query);
    console.log(`${result.deletedCount} documents deleted.`);
  } catch (error) {
    console.log("Error occurred while deleting documents:", error);
  }
}
module.exports = {
  insertData,
  getSocVoltageDataForChart,
  connectToDb,
  deleteOldDocuments

};
