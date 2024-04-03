#include "config.h"
#include "sensors.h"
#include "wifi.h"
#include "utils.h"
#include "oled.h"
#include "oled-utils.h"




void setup() {
    Serial.begin(9600); // Initialize serial communication
    initializeDisplay();
    displayLogo();
    initializeSensorPins(); // Initialize sensor pins
    initializeVariables();
    initializeTemperatureSensor();
    initializeFuelGauge();
    
    
    connectToWiFi(); // Connect to Wi-Fi
    clearDisplay();
    // displayLogo();
}
    


void loop() {
  
    
    readChargingState();
    
  readTemperature();
  initializeFuelGauge();
  readFuelGaugeData();
  // testdrawcircle();
  

  printLog();
  
  
  


  delay(500); // Adjust delay as needed
}
