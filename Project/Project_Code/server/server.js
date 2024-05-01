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
const writeData = require('./aiDataWrite');
// data = {
//   query: 'This is the data collected from battery discharge. It says how much voltage and SOc charges over the time. Now try to answer me. Based on the time and Soc tell me in how many minutes the Soc will be 100% based on prediction?'
// };
data = {
  query: 'Do you see any alerts based on the battery temperature'
};

let questionIndex = 0; // Initialize the index to 0
 questionsArray = [{
  query: 'Is the temperature is increasing or decreasing?'
}, {
  query: 'Whats the current SoC?'
}, {
  query: 'Whats the average voltage noted?'
}, {
  query: 'Is there any alerts?'
}, {
  query: 'Whats the current temperature of the battery?'
}, {
  query: 'Whats the battery connected to skyBMS?'
}
];

// Create WebSocket server
const wss = new WebSocket.Server({ port: websocketPort , host: '0.0.0.0'});
console.log(`Websocket Server running on ${process.env.MONGODB_HOST}:${websocketPort}`);

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('Websocket Client connected');

  // Handle messages from WebSocket clients
  ws.on('message', async function incoming(message) {
    try {
      const jsonData = JSON.parse(message);
      // console.log('Received JSON:', jsonData);
      if (jsonData && jsonData.type && jsonData.query && jsonData.type === "ai_query"){
        console.log('AI query received:', jsonData.query);

        data = {
          query: jsonData.query
        };
        answer = await getChatResponse(data);
        console.log('Answer:', answer);
        // Handle the JSON data as needed
      const messageObject = { 
        type:"ai_response",
      answer: answer  };

      console.log('messageObjectnswer:', JSON.stringify(messageObject));
      ws.send(JSON.stringify(messageObject));
      }
      

     

    
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
      // console.log('UNOR4:', jsonData);
      console.log('Arduino Data received!!!!!:');
      
      // Send Arduino data to WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          jsonData.type = "arduino_data";
          // writeData.updateAlert(20)
          client.send(JSON.stringify(jsonData));
        }
      });


      // Insert data into the database
      insertData(jsonData).catch(console.error);
      writeData.updateTemperature(jsonData.temperature)
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

async function aiInsights(){

  const question = questionsArray[questionIndex];
    
  // Increment the index for the next iteration
  questionIndex = (questionIndex + 1) % questionsArray.length;
  console.log(question);

  answer = await getChatResponse(question);
       
        // Handle the JSON data as needed

        if(answer){
          console.log('AI Insight Answer:', answer);
          const messageObject = { 
            type:"ai_insight",
          answer: answer  };
    
          console.log('ai_insight:', JSON.stringify(messageObject));
    
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(messageObject));
            }
          });
        }else{
          console.log("!!! AOI INSIGHT QUERTY FAILLED");
        }
      
}
// Set intervals for functions to run
setInterval(fetchSocDataAndProcess, 5000);
// setInterval(clearOldDocuments, 5000);
setInterval(getLatestRecordsWithinHour, 5000);
setInterval(aiInsights, 5000);


async function getChatResponse(data) {
  try {
    // First, execute the GET request to refresh the model
    const refreshModelResponse = await axios.get(`http://${process.env.OPENAI_SERVER_HOST}:${process.env.OPENAI_SERVER_PORT}/refresh-model`);

    // Check if the refresh model request was successful (status code 200)
    if (refreshModelResponse.status === 200) {
      console.log('Model refreshed successfully.');
      
      // If the model refresh was successful, proceed with the POST request to query
      const queryResponse = await axios.post(`http://${process.env.OPENAI_SERVER_HOST}:${process.env.OPENAI_SERVER_PORT}/query`, data);
      
      if(queryResponse && queryResponse.status === 200 && queryResponse.data && queryResponse.data.answer){
        // Handle the response data here
      // console.log('Response:', queryResponse.data);
        return {
          isSuccess : true,
          answer : queryResponse.data.answer
        }
      }
      
      
    } else {
      console.error('Model refresh failed. Status:', refreshModelResponse.status);
      // Handle the failure case appropriately
      return {
        isSuccess : false,
        answer : ""
      }
    }
  } catch (error) {
    console.error('AI Server call failed:', error.message);
    // Handle errors here
  }
}

// Start TCP server
server.listen(tcpPort, () => {
  const address = server.address();
  console.log(`TCP Server running on ${process.env.MONGODB_HOST}:${address.port}`);
  // Connect to the database
  connectToDb();
  console.log(`Hello ${process.env.HELLO}`)
  getChatResponse(data);
});

// Function to generate a unique key
function generateUniqueKey() {
  return uuidv4();
}
