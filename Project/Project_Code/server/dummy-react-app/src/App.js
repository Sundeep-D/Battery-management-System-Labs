import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  // Establish WebSocket connection
  useEffect(() => {
    // const ws = new WebSocket('ws://ec2-204-236-220-172.compute-1.amazonaws.com:8000');
    const ws = new WebSocket('ws://localhost:8001');
    // const ws = new WebSocket('wss://echo.websocket.org');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = event => {
      const jsonData = JSON.parse(event.data);
      console.log('Received JSON data from server:', jsonData);
      setData(jsonData); // Update state with received data
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close(); // Close WebSocket connection when component unmounts
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {data && (
          <div>
            <p>Voltage: {data.voltage}</p>
            <p>SOC: {data.soc}</p>
            <p>Temperature: {data.temperature}</p>
            <p>Is Charging: {data.is_charging ? 'Yes' : 'No'}</p>
            <p>Current Capacity: {data.current_capacity}</p>
          </div>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
