#include "utils.h"
#include "sensors.h"
#include "wifi.h"
void printLog() {

    Serial.print("Wifi: ");
    if(isWifiConnected){
      Serial.print("connected");
    }else{
      Serial.print("not-connected");
    }

  Serial.print(" | ");

Serial.print("Health Lipo: ");
    if(lipoHealth){
      Serial.print("OK");
    }else{
      Serial.print("ERR-RC");
    }


Serial.print(" Temp-Sensor: ");
    if(tempSensorHealth){
      Serial.print("OK");
    }else{
      Serial.print("ERR-RC");
    }

  Serial.print(" | ");

  Serial.print("V: ");
  Serial.print(voltage);
  Serial.print(" V");

  Serial.print(" | ");

  Serial.print("SoC: ");
  Serial.print(soc);
  Serial.print(" %");

  Serial.print(" | ");

  Serial.print("Temp: ");
  Serial.print(temperature);
  Serial.print(" C");

  Serial.print(" | ");

  if(isCharging){
      Serial.print("charging");
    }else{
      Serial.print("not-charging");
    }

  Serial.println();
}