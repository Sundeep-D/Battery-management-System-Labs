// src/App.js

import React, { useState } from 'react';
import './App.css';
import LiquidAnimation from './LiquidAnimation';

function App() {
  const [batteryLevel, setBatteryLevel] = useState(50); // Initial battery level

  // Function to change battery level (for demonstration)
  const handleChangeBatteryLevel = () => {
    const newLevel = Math.floor(Math.random() * 101); // Random value between 0 and 100
    setBatteryLevel(newLevel);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Battery Animation</h1>
      </header>
      <main>
        <LiquidAnimation batteryLevel={batteryLevel} />
        <button onClick={handleChangeBatteryLevel}>Change Battery Level</button>
      </main>
    </div>
  );
}

export default App;
