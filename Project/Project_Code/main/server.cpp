#include "config.h" 
#include "server.h" 
#include "wifi.h"
#include "oled.h"
#include "utils.h"
#include "sensors.h"
#include <ArduinoJson.h>
WiFiClient client;
bool isServerConnected;
char uuid[37];


void connectToServer() {
  isServerConnected = false;
  displayHealthCheckScreen();
  
  if (isWifiConnected) {
    Serial.println("\nStarting connection to server...");

    if (client.connect(SERVER_DOMAIN, SERVER_PORT)) {
      Serial.println("Connected to server");

      // Create a JSON object
      StaticJsonDocument<300> jsonDoc; // Increase the buffer size to accommodate the larger JSON
      jsonDoc["message"] = "Handshake from Arduino";
      jsonDoc["status"] = "OK";
      
      // Serialize JSON to a string
      String jsonString;
      serializeJson(jsonDoc, jsonString);
      
      // Send JSON data over the connection
      client.println(jsonString);
       // Read the unique key sent by the server
      String uniqueKey = client.readStringUntil('\n');
      uniqueKey.trim(); // Remove any leading/trailing whitespace

// Convert Arduino String to const char* using c_str() method
const char* uniqueKeyCString = uniqueKey.c_str();
      strcpy(uuid, uniqueKeyCString);
      Serial.print("Unique Key from Server: ");
      Serial.println(uuid);
      

      isServerConnected = true;
      displayHealthCheckScreen();
    } else {
      Serial.println("Error connecting to server");
      isServerConnected = false;
    }
  }
}


void sendDataToServer() {
  if (isWifiConnected) {

    if (client.connected()){
      StaticJsonDocument<300> jsonDoc; // Increase the buffer size to accommodate the larger JSON
      jsonDoc["uuid"] = uuid;
      jsonDoc["voltage"] = voltage;
      jsonDoc["soc"] = soc;
      jsonDoc["temperature"] = temperature; 
      jsonDoc["is_charging"] = isCharging; 
      jsonDoc["current_capacity"] = (int)calculateCapacity(voltage, soc); 
      
      // Serialize JSON to a string
      String jsonString;
      serializeJson(jsonDoc, jsonString);
      
      // Send JSON data over the connection
      client.println(jsonString);
    }else{
      isServerConnected = false;
      Serial.println("Retrying to connect server");
      if (client.connect(SERVER_DOMAIN, SERVER_PORT)) {
        isServerConnected = true;
        Serial.println("Retrying successfull! Connected!");
      }else{
        isServerConnected = false;
      }
    }
  }
}
