const net = require('net');

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

const port = 8888;
server.listen(port, () => {
  const address = server.address(); // Get server address
  console.log(`Server running on ${address.address}:${address.port}`);
});
