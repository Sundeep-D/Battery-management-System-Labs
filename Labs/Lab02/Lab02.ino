#include <SPI.h>
#include <SD.h>
#include "myFunctions.h"

String fileName;
#define ANALOG_IN_PIN A0
File logFile;

void setup() {
  Serial.begin(115200);
  while (!Serial);
  
  fileName = "Log.txt";
  deleteLogFile(fileName);
  prepareSdCard();  
  logFile = createLogFile(fileName,logFile);
  
}

void loop() {
  logFile = SD.open(fileName, FILE_WRITE);

  if (logFile) {
    logFile.println(getFormattedTimestamp(getVoltageReading(ANALOG_IN_PIN)));
    logFile.close();
  } else {
    Serial.println("SD card ejected!");
    while(1);
  }
  delay(500);
}
