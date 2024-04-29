// src/LiquidAnimation.js

import React from 'react';
import PropTypes from 'prop-types';
import './LiquidAnimation.css';

const LiquidAnimation = ({ batteryLevel }) => {
  const liquidHeight = `${batteryLevel}%`;

  return (
    <div className="battery-container">
      <div className="battery">
        <div className="liquid" style={{ height: liquidHeight }}></div>
      </div>
    </div>
  );
};

LiquidAnimation.propTypes = {
  batteryLevel: PropTypes.number.isRequired,
};

export default LiquidAnimation;
