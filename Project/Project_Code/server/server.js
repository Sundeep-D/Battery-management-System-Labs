const net = require('net');
const { v4: uuidv4 } = require('uuid');
const port = 8000;

const server = net.createServer(socket => {
  console.log('Client connected');

  // Generate a unique key
  const uniqueKey = generateUniqueKey();

  socket.on('data', data => {
    console.log('UNOR4:', data.toString());
    // You can add logic here to handle incoming data from Arduino
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
  });

  // Send the unique key to the Arduino after the handshake
  socket.write(uniqueKey);
  console.log(`Handshake successfull! Sent ${uniqueKey} to Arduino.`);
});

server.listen(port, () => {
  const address = server.address();
  console.log(`Server running on ${address.address}:${address.port}`);
});

// Function to generate a unique key
function generateUniqueKey() {
    return uuidv4(); //added
}
