const net = require('net');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');
const clear = require('cli-clear');
const insertData = require('./databaseUtils');
const constants = require('./constants');

const websocketPort = 8001;
const tcpPort = 8000;

const wss = new WebSocket.Server({ port: websocketPort });
console.log(`Websocket Server running on ${constants.host}:${websocketPort}`);

wss.on('connection', function connection(ws) {
  console.log('Websocket Client connected');

  ws.on('message', function incoming(message) {
    console.log('Received:', message);
    // Echo back the received message to the client
    ws.send(message);
  });

  ws.on('close', function () {
    console.log('Websocket Client disconnected');
  });
});

const server = net.createServer(socket => {
  console.log('Client connected');

  // Generate a unique key
  const uniqueKey = generateUniqueKey();

  socket.on('data', data => {
    const jsonData = parseJson(data.toString());
    if (jsonData) {
      clear();
      console.log('UNOR4:', jsonData);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(jsonData));
        } else {
          // console.log('Error sending data to websocket clients:');
        }
      });
      insertData(jsonData).catch(console.error);
    } else {
      // console.log('Invalid JSON data or empty:', data.toString());
    }

    if (jsonData) {
      // Send data to WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(jsonData));
        }
      });
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
  });

  // Send the unique key to the Arduino after the handshake
  socket.write(uniqueKey);

  const sendUniqueKeyInterval = setInterval(() => {
    const key = generateUniqueKey();
    socket.write(key);
    console.log(`Sent ${key} to Arduino.`);
  }, 90000);

  console.log(`Handshake successful! Sent ${uniqueKey} to Arduino.`);
});

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

server.listen(tcpPort, () => {
  const address = server.address();
  console.log(`TCP Server running on ${constants.host}:${address.port}`);
});

// Function to generate a unique key
function generateUniqueKey() {
  return uuidv4();
}
