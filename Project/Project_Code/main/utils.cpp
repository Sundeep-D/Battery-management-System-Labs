#include "utils.h"
#include "sensors.h"
#include "wifi.h"
#include "ArduinoGraphics.h"
#include "Arduino_LED_Matrix.h"
ArduinoLEDMatrix matrix;

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

   Serial.print(" | ");

   Serial.print("CC: ");
  Serial.print(calculateCapacity(voltage, soc));
  Serial.print(" mAh");

  Serial.println();
}

void initializeLedMatrix(){
  matrix.begin();
}
void ledMatrixPrintLogo(){
  // matrix.beginDraw();

  // matrix.stroke(0xFFFFFFFF);
  // matrix.textScrollSpeed(70);

  // // add the text
  // const char text[] = "   SKY BMS";
  // matrix.textFont(Font_5x7);
  // matrix.beginText(0, 1, 0xFFFFFF);
  // matrix.println(text);
  // matrix.endText(SCROLL_LEFT);

  // matrix.endDraw();
const uint32_t bt[] = {
		0xffe802aa,
		0xbaabaaba,
		0xab802ffe,
		66
	};


  matrix.loadFrame(bt);
}