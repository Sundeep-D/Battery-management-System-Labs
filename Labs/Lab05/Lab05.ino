#include <SPI.h>
#include <SD.h>
#include "myFunctions.h"

String logFileName;
String csvFileName;
#define ANALOG_IN_PIN_V1 A0 //OUTER CIRCUIT
#define ANALOG_IN_PIN_V2 A1 //INNER CIRCUIT
File logFile;
File csvFile;
const int relayPin = 7;

void setup() {
  Serial.begin(115200);
  // Set the relay pin as an OUTPUT
  pinMode(relayPin, OUTPUT);
  while (!Serial);
  
  logFileName = "Log.txt";
  csvFileName = "Log.csv";

  deleteFile(logFileName);
  deleteFile(csvFileName);
  prepareSdCard();  
  logFile = createLogFile(logFileName,logFile);
  csvFile = createCsvFile(csvFileName,csvFile);
  
}

void loop() {
  logFile = SD.open(logFileName, FILE_WRITE);
  csvFile = SD.open(csvFileName, FILE_WRITE);
  // digitalWrite(relayPin, HIGH);
  relayTimer();

  if (logFile) {
    writeData(
    logFile,
    csvFile,
    getVoltageReading(ANALOG_IN_PIN_V1),
    getVoltageReading(ANALOG_IN_PIN_V2)
    );
    // logFile.println());
    logFile.close();
    csvFile.close();
    

  } else {
    Serial.println("SD card ejected!");
    while(1);
  }
  delay(500);
}
