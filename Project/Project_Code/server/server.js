const net = require('net');




const port = 8000;

const server = net.createServer(socket => {
  console.log('Client connected');

  socket.on('data', data => {
    console.log('Data from Arduino:', data.toString());
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', err => {
    console.error('Socket error:', err);
  });
});

server.listen(port, () => {
  const address = server.address(); // Get server address
  console.log(`Server running on ${address.address}:${address.port}`);
});
