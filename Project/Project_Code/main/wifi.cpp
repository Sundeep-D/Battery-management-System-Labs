#include "wifi.h"
#include "oled.h"
bool isWifiConnected;

void connectToWiFi() {
  Serial.println("Connecting to Wi-Fi...");
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD); // Use credentials from config.h
  
  while (WiFi.status() != WL_CONNECTED) {
    // delay(1000);
    Serial.println("Connecting...");
    isWifiConnected=false;
    displayWifiConnectScreen();
    
  }
  
  isWifiConnected=true;
  Serial.println("Connected to Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
}