#include "config.h"
#include "sensors.h"
#include "wifi.h"
#include "utils.h"
#include "oled.h"
#include "oled-utils.h"
#include "server.h"

// void setup(){
//   Serial.begin(9600); // Initialize serial communication
    
// initializeLedMatrix();
//     initializeDisplay();
// displayHealthCheckScreen();
// }
// void loop(){

// }
void setup() {
    Serial.begin(9600); // Initialize serial communication
    
initializeLedMatrix();
    initializeDisplay();
     ledMatrixPrintLogo();
    displayLogo();
    initializeSensorPins(); // Initialize sensor pins
    initializeVariables();
    initializeTemperatureSensor();
    initializeFuelGauge();
    
    
    connectToWiFi(); // Connect to Wi-Fi
    connectToServer();
    delay(2000);
    clearDisplay();
    circuitShutdown(false);
    // delay(5000);
    // circuitShutdown(true);
    // displayLogo();
}
    


void loop() {
 
 sendDataToServer();
 readDataFromServer();
    displayInfoScreen();
    readChargingState();
    checkWifiConnection();
    
  readTemperature();
  // initializeFuelGauge();   //need for future use
  readFuelGaugeData();
  

  // printLog();
  


  delay(500);
}