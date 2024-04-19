const net = require('net');
const { v4: uuidv4 } = require('uuid');
const port = 8000;
const clear = require('cli-clear');
const insertData = require('./databaseUtils');



const server = net.createServer(socket => {
  console.log('Client connected');

  // Generate a unique key
  const uniqueKey = generateUniqueKey();

  socket.on('data', data => {
    const jsonData = parseJson(data.toString());
    if (jsonData) {
        clear();
        console.log('UNOR4:', jsonData);
        insertData(jsonData).catch(console.error);
    } else {
        // console.log('Invalid JSON data or empty:', data.toString());
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
    }, 10000);

  console.log(`Handshake successfull! Sent ${uniqueKey} to Arduino.`);
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

server.listen(port, () => {
  const address = server.address();
  console.log(`Server running on ${address.address}:${address.port}`);
});

// Function to generate a unique key
function generateUniqueKey() {
    return uuidv4(); //added
}
