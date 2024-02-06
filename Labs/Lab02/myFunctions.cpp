#include "myFunctions.h"

static unsigned long startTime;
float adc_voltage = 0.0;
float in_voltage = 0.0;
float R1 = 30000.0;
float R2 = 7500.0;
float ref_voltage = 5.0;
int adc_value = 0;
int SD_PIN=10;
float resistance = 220;
unsigned long timeNow = 0;
unsigned long lastTime = 0;


void prepareSdCard() {
    Serial.println("Preparing SD card...");

    if (!SD.begin(SD_PIN)) {
        Serial.println("SD card not found!");
        while (1);
    }
}

int addNumbers(int a, int b) {
    return a + b;
}

File createLogFile(String fileName,File logFile) {
    Serial.println("Creating log file " + fileName);
    logFile = SD.open(fileName, FILE_WRITE);

    if (logFile) {
        // Serial.println("==========================");
        // Serial.println("|  Timestamp  | SoC (V)  |");
        // Serial.println("==========================");
        logFile.close();
        return logFile;
    } else {
        Serial.println("Error opening the file " + fileName);
        return logFile;
    }
}

File createCsvFile(String fileName,File csvFile) {
    Serial.println("Creating CSV file " + fileName);
    csvFile = SD.open(fileName, FILE_WRITE);

    if (csvFile) {
        csvFile.println("Timestamp,Voltage1,Voltage2,Current,Capacity");
        csvFile.close();
        return csvFile;
    } else {
        Serial.println("Error opening the file " + fileName);
        return csvFile;
    }
}

void writeData(File logFile,File csvFile,float V1,float V2) {
    lastTime = timeNow;
    long timeNow = millis();
    float current=calculateCurrent(V2);
    float capacity = calculateCapacity(current,timeNow);

    String formattedStringForSerial =
    "T: "+String(timeNow) 
    + " | V1: " + String(V1)+"V"
    + " | V2: " + String(V2)+"V"
    + " | I: " + String(current)+"mA"
    + " | C: " + String(capacity) + "mAh";

    String formattedStringForLog = 
    String(timeNow) 
    +"," 
    + String(V1)
    +"," 
    + String(V2)
    +"," 
    + String(current)
    +"," 
    + String(capacity);

    String formattedStringForCsv = 
    String(timeNow) 
    +"," 
    + String(V1)
    +"," 
    + String(V2)
    +"," 
    + String(current)
    +"," 
    + String(capacity);

    Serial.println(formattedStringForSerial);
    logFile.println(formattedStringForLog);
    csvFile.println(formattedStringForCsv);
}

float getVoltageReading(int analogPin) {
    adc_value = analogRead(analogPin);
    adc_voltage = (adc_value * ref_voltage) / 1024.0;
    in_voltage = adc_voltage * (R1 + R2) / R2;

    return in_voltage;
}

void deleteFile(String fileName){

    if (!SD.begin(SD_PIN)) {
    Serial.println("SD card not found!");
    while (1);
  }
  Serial.println("Deleting file: "+fileName);

  if (SD.remove(fileName)) {
    Serial.println("File "+fileName+" deleted successfully.");
  } else {
    Serial.println("Error deleting file "+fileName);
  }
}

float calculateCurrent(float voltage) {
  // Calculate current using Ohm's Law: I = V / R
  // voltage=voltage*1000;
  Serial.println("V="+String(voltage));
  float current = (voltage / resistance)*1000;
  Serial.println("I="+String(current));
  return current;
}

float calculateCapacity(float current, long time) {
  // Capacity = I/Time
  // float capacity_mAh = (current * time) / 36000000;
   float capacity_mAh = (current * (time-lastTime)) / 36000000;
  // Serial.println("C="+String(capacity));
  return capacity_mAh;
}

// I=V/R = 41mA
// Capacity = I/Time
