// Import required modules
const net = require('net');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const clear = require('cli-clear');
const { insertData, getSocVoltageDataForChart, connectToDb, deleteOldDocuments, getLatestRecordsWithinHour } = require('./databaseUtils'); // Import functions from database utilities
const constants = require('./constants'); // Import constant values
require('dotenv').config();
const axios = require('axios');
const websocketPort = process.env.WEBSOCKET_SERVER_PORT;
const tcpPort = process.env.TCP_SERVER_PORT;
// data = {
//   query: 'This is the data collected from battery discharge. It says how much voltage and SOc charges over the time. Now try to answer me. Based on the time and Soc tell me in how many minutes the Soc will be 100% based on prediction?'
// };
data = {
  query: 'Do you see any alerts based on the battery temperature'
};

// Create WebSocket server
const wss = new WebSocket.Server({ port: websocketPort });
console.log(`Websocket Server running on ${process.env.MONGODB_HOST}:${websocketPort}`);

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('Websocket Client connected');

  // Handle messages from WebSocket clients
  ws.on('message', function incoming(message) {
    try {
      const jsonData = JSON.parse(message);
      console.log('Received JSON:', jsonData);
      // Handle the JSON data as needed
      const messageObject = { 
        type:"ai_response",
        answer: "This is a demo answer from AI Stash your changes: Stashing your changes will temporarily store them away, allowing you to pull the latest changes from the remote repository. After pulling, you can apply your stashed changes back if needed." 
      };
    ws.send(JSON.stringify(messageObject));
    } catch (error) {
      // If parsing as JSON fails, log the message as a string
      console.log('Received message:', message);
      // Handle the non-JSON message as needed
    }
  });

  // Handle WebSocket client disconnection
  ws.on('close', function () {
    console.log('Websocket Client disconnected');
  });
});

// Create TCP server
const server = net.createServer({ host: '0.0.0.0' },socket => {
  console.log('Client connected');

  // Generate a unique key
  const uniqueKey = generateUniqueKey();

  // Handle data received from Arduino
  socket.on('data', data => {
    const jsonData = parseJson(data.toString());
    if (jsonData) {
      console.log('UNOR4:', jsonData);
      // Send Arduino data to WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          jsonData.type = "arduino_data";
          client.send(JSON.stringify(jsonData));
        }
      });
      // Insert data into the database
      insertData(jsonData).catch(console.error);
    }

    // Send data to WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonData));
      }
    });
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  // Handle socket errors
  socket.on('error', err => {
    console.error('Socket error:', err);
  });

  // Send the unique key to the Arduino after the handshake
  socket.write(uniqueKey);

  // Set interval to send unique key to Arduino
  const sendUniqueKeyInterval = setInterval(() => {
    const key = generateUniqueKey();
    socket.write(key);
    console.log(`Sent ${key} to Arduino.`);
  }, 90000);

  console.log(`Handshake successful! Sent ${uniqueKey} to Arduino.`);
});

// Function to parse JSON data
function parseJson(dataString) {
  try {
    const jsonData = JSON.parse(dataString);
    if (Object.keys(jsonData).length === 0 && jsonData.constructor === Object) {
      // Check if it's empty JSON
      return null;
    }
    return jsonData;
  } catch (error) {
    // If parsing fails, it's not valid JSON
    return null;
  }
}

// Function to fetch SOC data from database and process it
async function fetchSocDataAndProcess() {
  try {
    const data = await getSocVoltageDataForChart();
    // Send processed data to UI
    sendToUI(data, "soc_chart_data");
  } catch (err) {
    console.error('Error fetching and processing data:', err);
  }
}

// Function to send processed data to UI
function sendToUI(processedData, type) {
  if (processedData) {
    processedData.type = type;
    // console.log(JSON.stringify(processedData));
    console.log("Chart Data sent to UI");
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(processedData));
      }
    });
  }
}

// Function to clear old documents from database
async function clearOldDocuments() {
  await deleteOldDocuments();
}

// Set intervals for functions to run
setInterval(fetchSocDataAndProcess, 5000);
// setInterval(clearOldDocuments, 5000);
setInterval(getLatestRecordsWithinHour, 5000);


async function getChatResponse() {
  axios.post(`http://${process.env.OPENAI_SERVER_HOST}:${process.env.OPENAI_SERVER_PORT}/query`, data)
  .then(response => {
    console.log('Response:', response.data);
    // Handle the response data here
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle errors here
  });
}

// Start TCP server
server.listen(tcpPort, () => {
  const address = server.address();
  console.log(`TCP Server running on ${process.env.MONGODB_HOST}:${address.port}`);
  // Connect to the database
  connectToDb();
  console.log(`Hello ${process.env.HELLO}`)
  getChatResponse();
});

// Function to generate a unique key
function generateUniqueKey() {
  return uuidv4();
}
