// /******************************************************************************
// Example1_Simple
// By: Paul Clark
// Date: October 23rd 2020

// Based extensively on:
// MAX17043_Simple_Serial.cpp
// SparkFun MAX17043 Example Code
// Jim Lindblom @ SparkFun Electronics
// Original Creation Date: June 22, 2015

// This file demonstrates the simple API of the SparkFun MAX17043 Arduino library.

// This example will print the gauge's voltage and state-of-charge (SOC) readings
// to Serial (115200 baud)

// This code is released under the MIT license.

// Distributed as-is; no warranty is given.
// ******************************************************************************/

// #include <Wire.h> // Needed for I2C

// #include <SparkFun_MAX1704x_Fuel_Gauge_Arduino_Library.h> // Click here to get the library: http://librarymanager/All#SparkFun_MAX1704x_Fuel_Gauge_Arduino_Library

// SFE_MAX1704X lipo; // Defaults to the MAX17043

// //SFE_MAX1704X lipo(MAX1704X_MAX17043); // Create a MAX17043
// //SFE_MAX1704X lipo(MAX1704X_MAX17044); // Create a MAX17044
// //SFE_MAX1704X lipo(MAX1704X_MAX17048); // Create a MAX17048
// //SFE_MAX1704X lipo(MAX1704X_MAX17049); // Create a MAX17049

// double voltage = 0; // Variable to keep track of LiPo voltage
// double soc = 0; // Variable to keep track of LiPo state-of-charge (SOC)
// bool alert; // Variable to keep track of whether alert has been triggered

// void setup()
// {
// 	Serial.begin(115200); // Start serial, to output debug data
//   while (!Serial)
//     ; //Wait for user to open terminal
//   Serial.println(F("MAX17043 Example"));

//   Wire.begin();

//   // lipo.enableDebugging(); // Uncomment this line to enable helpful debug messages on Serial

//   // Set up the MAX17043 LiPo fuel gauge:
//   if (lipo.begin() == false) // Connect to the MAX17043 using the default wire port
//   {
//     Serial.println(F("MAX17043 not detected. Please check wiring. Freezing."));
//     while (1)
//       ;
//   }

// 	// Quick start restarts the MAX17043 in hopes of getting a more accurate
// 	// guess for the SOC.
// 	lipo.quickStart();

// 	// We can set an interrupt to alert when the battery SoC gets too low.
// 	// We can alert at anywhere between 1% - 32%:
// 	lipo.setThreshold(20); // Set alert threshold to 20%.
// }

// void loop()
// {
//   // lipo.getVoltage() returns a voltage value (e.g. 3.93)
//   voltage = lipo.getVoltage();
//   // lipo.getSOC() returns the estimated state of charge (e.g. 79%)
//   soc = lipo.getSOC();
//   // lipo.getAlert() returns a 0 or 1 (0=alert not triggered)
//   alert = lipo.getAlert();

//   // Print the variables:
//   Serial.print("Voltage: ");
//   Serial.print(voltage);  // Print the battery voltage
//   Serial.println(" V");

//   Serial.print("Percentage: ");
//   Serial.print(soc); // Print the battery state of charge
//   Serial.println(" %");

//   Serial.print("Alert: ");
//   Serial.println(alert);
//   Serial.println();

//   delay(500);
// }


// #include "Arduino.h"
// #include "Wire.h"
// #include "MAX1704.h"

// MAX1704 fuelGauge;

// void setup(){
  
//  Wire.begin(); 
//  Serial.begin(9600);
 
//  Serial.println("Starting up...");
//  delay(1000);
//  fuelGauge.reset();
//  fuelGauge.quickStart();
//  fuelGauge.showConfig();
//  delay(1000);
// }

// void loop(){

//  delay(1000);
//   float charge = fuelGauge.stateOfCharge();
//   Serial.println(charge);
//   delay(1000);
// }

/*
   MAX1704X Arduino Library for MAX17043 and MAX17044 Fuel Gauge.

   Copyright © 2018-2022 Daniel Porrey. All Rights Reserved.
   https://github.com/porrey/max1704x

   This file is part of the MAX1704X Arduino Library.

   The MAX1704X Arduino Library is free software: you can redistribute
   it and/or modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   The MAX1704X Arduino Library is distributed in the hope that it
   will be useful, but WITHOUT ANY WARRANTY; without even the implied
   warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
   the GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with the MAX1704X Arduino Library. If not,
   see http://www.gnu.org/licenses/.
*/
#include "MAX1704X.h"

// ***
// *** Connections:
// *** 1) Conect SDA pin to A4 on Uno
// *** 2) Connect SCL pin to A5 on Uno
// *** 3) Connect the GND pin to ground on the Uno.
// ***
// *** For other devices lookup the correct i2C
// *** (SDA and SCL) pins.
// ***

//
// Define the MAX17403 fuel gauge. Use MAX17044_mV
// for the MAX17044.
//
MAX1704X _fuelGauge = MAX1704X(MAX17043_mV);

void setup()
{
  //
  // Initialize the serial interface.
  //
  Serial.begin(115200);
  delay(250);

  //
  // Wait for serial port to connect.
  //
  while (!Serial) {}
  Serial.println("Serial port initialized.\n");

  //
  // Initialize the fuel gauge without an address.
  //
  Serial.println("Initializing the fuel gauge instance.");
  _fuelGauge.begin(DEFER_ADDRESS);

  //
  // Find a connected fuel gauge on the i2c bus.
  //
  Serial.println("Searching for device...");
  uint8_t deviceAddress = _fuelGauge.findFirstDevice();

  //
  // If a device is NOT found, the address returned will be 0.
  //
  if (deviceAddress > 0)
  {
    //
    // Set the device address.
    //
    _fuelGauge.address(deviceAddress);
    Serial.print("A MAX17043 device was found at address 0x"); Serial.println(_fuelGauge.address(), HEX);

    //
    // Reset the device.
    //
    Serial.println("Resetting device...");
    _fuelGauge.reset();
    delay(250);

    //
    // Issue a quickstart command and wait
    // for the device to be ready.
    //
    Serial.println("Initiating quickstart mode...");
    _fuelGauge.quickstart();
    delay(125);

    //
    // Display an initial reading.
    //
    Serial.println("Reading device...");
    Serial.println();
    displayReading();
    Serial.println();
    displayMenu();
  }
  else
  {
    Serial.println("A MAX17043 device was not found!");
    while (true);
  }
}

void loop()
{
  //
  // Wait for serial input.
  //
  while (Serial.available() == 0)
  {
    delay(25);
  }

  char c = Serial.read();

  switch (c)
  {
    case 'M':
    case 'm':
      displayMenu();
      break;
    case 'D':
    case 'd':
      displayReading();
      break;
    case 'S':
    case 's':
      sleepMode();
      break;
    case 'W':
    case 'w':
      wakeMode();
      break;
    case 'Q':
    case 'q':
      quickStart();
      break;
    case 'C':
    case 'c':
      clearAlert();
      break;
    case 'R':
    case 'r':
      reset();
      break;
    case '+':
      incrementThreshold();
      break;
    case '-':
      decrementThreshold();
      break;
  }
}

void displayMenu()
{
  Serial.println("Enter an option in the serial input (M for menu):");
  Serial.println("D => Display a reading.");
  Serial.println("S => Enter sleep mode.");
  Serial.println("W => Wake.");
  Serial.println("Q => Quick start.");
  Serial.println("C => Clear alert.");
  Serial.println("R => Reset.");
  Serial.println("+ => Increment threshold.");
  Serial.println("- => Decrement threshold.");
  Serial.println();
}

void displayReading()
{
  //
  // Get the voltage, battery percent
  // and other properties.
  //
  Serial.println("Device Reading:");
  Serial.print("Address:       0x"); Serial.println(_fuelGauge.address(), HEX);
  Serial.print("Version:       "); Serial.println(_fuelGauge.version());
  Serial.print("ADC:           "); Serial.println(_fuelGauge.adc());
  Serial.print("Voltage:       "); Serial.print(_fuelGauge.voltage()); Serial.println(" mV");
  Serial.print("Percent:       "); Serial.print(_fuelGauge.percent()); Serial.println("%");
  Serial.print("Is Sleeping:   "); Serial.println(_fuelGauge.isSleeping() ? "Yes" : "No");
  Serial.print("Alert:         "); Serial.println(_fuelGauge.alertIsActive() ? "Yes" : "No");
  Serial.print("Threshold:     "); Serial.print(_fuelGauge.getThreshold()); Serial.println("%");
  Serial.print("Compensation:  0x"); Serial.println(_fuelGauge.compensation(), HEX);
  Serial.println();
}

void sleepMode()
{
  if (!_fuelGauge.isSleeping())
  {
    _fuelGauge.sleep();

    if (_fuelGauge.isSleeping())
    {
      Serial.println("Fuel Gauge put in sleep mode.");
    }
    else
    {
      Serial.println("Fuel Gauge failed to be put in sleep mode.");
    }
  }
  else
  {
    Serial.println("Fuel Gauge is already in sleep mode.");
  }
}

void wakeMode()
{
  if (_fuelGauge.isSleeping())
  {
    _fuelGauge.wake();

    if (!_fuelGauge.isSleeping())
    {
      Serial.println("Fuel Gauge is now awake.");
    }
    else
    {
      Serial.println("Failed to wake Fuel Gauge.");
    }
  }
  else
  {
    Serial.println("Fuel Gauge is already awake.");
  }
}

void reset()
{
  _fuelGauge.reset();
  Serial.println("Fuel Gauge has been reset/rebooted.");
}

void quickStart()
{
  _fuelGauge.quickstart();
  Serial.println("Quick start has been initiated on the Fuel Gauge.");
}

void clearAlert()
{
  _fuelGauge.clearAlert();
  Serial.println("The alert has been cleared on the Fuel Gauge.");
}

void incrementThreshold()
{
  uint8_t threshold = _fuelGauge.threshold();
  _fuelGauge.threshold(++threshold);
  Serial.print("The alert threshold has been incremented to "); Serial.print(_fuelGauge.threshold()); Serial.println(",");
}

void decrementThreshold()
{
  uint8_t threshold = _fuelGauge.threshold();
  _fuelGauge.threshold(--threshold);
  Serial.print("The alert threshold has been decremented to "); Serial.print(_fuelGauge.threshold()); Serial.println(",");
}