#include "config.h" 
#include "server.h" 
#include "wifi.h"
#include "oled.h"
#include <ArduinoJson.h>
WiFiClient client;
bool isServerConnected;
long key = random(1000000000, 9999999999);


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
      jsonDoc["key"] = key; // Add the random number to the JSON
      
      // Serialize JSON to a string
      String jsonString;
      serializeJson(jsonDoc, jsonString);
      
      // Send JSON data over the connection
      client.println(jsonString);
       // Read the unique key sent by the server
      String uniqueKey = client.readStringUntil('\n');
      Serial.print("Unique Key from Server: ");
      Serial.println(uniqueKey);
      
      isServerConnected = true;
      displayHealthCheckScreen();
    } else {
      Serial.println("Error connecting to server");
      isServerConnected = false;
    }
  }
}
