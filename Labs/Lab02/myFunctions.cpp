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
unsigned long previousMillis = 0;
float totalCapacity=0;
float currentCapacity=0;


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
        csvFile.println("Timestamp,Voltage1,Voltage2,Current,CurrentCapacity,TotalCapacity");
        csvFile.close();
        return csvFile;
    } else {
        Serial.println("Error opening the file " + fileName);
        return csvFile;
    }
}

void writeData(File logFile,File csvFile,float V1,float V2) {
    long currentTime = millis();
    float current=calculateCurrent(V1,V2);
    calculateCapacity(current,currentTime);

    String formattedStringForSerial =
    "T: "+String(currentTime) 
    + " | V1: " + String(V1)+"V"
    + " | V2: " + String(V2)+"V"
    + " | I: " + String(current)+"mA"
    + " | CC: " + String(currentCapacity,6) + "mAh"
    + " | TC: " + String(totalCapacity,6) + "mAh";

    String formattedStringForLog = 
    String(currentTime) 
    +"," 
    + String(V1)
    +"," 
    + String(V2)
    +"," 
    + String(current)
    +"," 
    + String(currentCapacity,6)
    +"," 
    + String(totalCapacity,6);

    String formattedStringForCsv = 
    String(currentTime) 
    +"," 
    + String(V1)
    +"," 
    + String(V2)
    +"," 
    + String(current)
    +"," 
    + String(currentCapacity,6)
    +"," 
    + String(totalCapacity,6);

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

float calculateCurrent(float voltage1,float voltage2) {
  // Calculate current using Ohm's Law: I = V / R
  float current = voltage2 / resistance;
  return current * 1000.0;  // Convert current to milliamperes
}

float calculateCapacity(float current_mA, long currentMillis) {
  // // Capacity = I/Time
  // // float capacity_mAh = (current * time) / 36000000;
  //  float capacity_mAh = (current * (time-lastTime)) / 36000000;
  // // Serial.println("C="+String(capacity));
  // return capacity_mAh;

    // Calculate elapsed time since the previous timestamp
  float elapsedTime = (currentMillis - previousMillis) / 3600000.0;  // Convert milliseconds to hours

  // Calculate capacity using the formula: Capacity (mAh) = Current (mA) * Time (hours)
  currentCapacity = current_mA * elapsedTime;

  // Add the current capacity to the total capacity
  totalCapacity += currentCapacity;

  // Update the previous timestamp and current value for the next calculation
  previousMillis = currentMillis;

  return currentCapacity;

}

