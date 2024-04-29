#include <SPI.h>
#include <SD.h>
#include "myFunctions.h"
// #include <EEPROM.h>
String logFileName;
String csvFileName;
#define ANALOG_IN_PIN_V1 A0 //OUTER CIRCUIT
#define ANALOG_IN_PIN_V2 A1 //INNER CIRCUIT
File logFile;
File csvFile;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  
    readVoltageDataFromEEPROM(); //To pull stored data from EPROM and load variables
    delay(1000);
  readCurrentDataFromEEPROM();

  delay(3000);
  // clearEEPROM();
}

void loop() {
  
  
    writeData(
    getVoltageReading(ANALOG_IN_PIN_V1),
    getVoltageReading(ANALOG_IN_PIN_V2)
    );

 
  delay(500);
}
