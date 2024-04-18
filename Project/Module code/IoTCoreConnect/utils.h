#include <Arduino_BuiltIn.h>

#include "certs.h"
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"

#define AWS_IOT_PUBLISH_TOPIC   "UnoR4/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "UnoR4/sub"

WiFiSSLClient net;
PubSubClient client(net);

void messageHandler(char* topic, byte* payload, unsigned int length) {
  Serial.print("incoming: ");
  Serial.println(topic);
 
  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload);
  const char* message = doc["message"];
  Serial.println(message);
}


void connectAWS() {
  // WiFi.mode(WIFI_STA);
  Serial.print(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
 
  Serial.println("Connecting to Wi-Fi");
 
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    // Serial.print(WIFI_SSID);
    Serial.print(".");
  }
 
  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  // net.setClientCertificate(AWS_CERT_CRT,AWS_CERT_PRIVATE);
 
  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.setServer(AWS_IOT_ENDPOINT, 8883);
 
  // Create a message handler
  client.setCallback(messageHandler);
 
  Serial.println("Connecting to AWS IOT");
 
  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }
 
  if (!client.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }
 
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
 
  Serial.println("AWS IoT Connected!");
}

void publishMessage(int metricsValue) {
  StaticJsonDocument<200> doc;
  doc["metrics"] = metricsValue;

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
 
  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}