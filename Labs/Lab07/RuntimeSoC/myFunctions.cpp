#include "myFunctions.h"
#include <EEPROM.h>
#include <float.h>
#include <Arduino.h>
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

// Variables needed for interpolation
#define FLT_MAX 3.4028235e38
int address = 0;
int previousResult = 100;
int previousSoC = 100;
#define ARRAY_SIZE 101
float readVoltage[ARRAY_SIZE];

void prepareSdCard() {
    Serial.println("Preparing SD card...");

    if (!SD.begin(SD_PIN)) {
        Serial.println("SD card not found!");
        while (1);
    }
    // else{
    //   Serial.println("SD card initialized!");
    // }
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

void writeData(float V1,float V2) {
    long currentTime = millis();
    float current=calculateCurrent(V1,V2);
    calculateCapacity(current,currentTime);

    String formattedStringForSerial =
    "T: "+String(currentTime) 
    + " | V1: " + String(V1)+"V"
    + " | V2: " + String(V2)+"V"
    + " | I: " + String(current)+"mA"
    + " | OCV: " + String(getOCV(V1,current))+"V"
    + " | SoC: " + String(findSoC(getOCV(V1,current),readVoltage, ARRAY_SIZE))+"%";


    Serial.println(formattedStringForSerial);
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

void readDataFromEEPROM() {
  Serial.println("Preparing to read from EPROM");
  EEPROM.get(address, readVoltage);
  int numElements = sizeof(readVoltage) / sizeof(readVoltage[0]);
  Serial.println("Data successfully retreived from EPROM");
  
  Serial.print(numElements);
  Serial.print(" values found");
  Serial.println("");
}

float getOCV(float V1,float current) {
    float current_A=current/1000; //Convert mA to A
    int R=5; //Take a average R observed in Lab05 
    return (V1+(current_A*R));
}


int findSoC(float value, float readVoltage[], int size) {
  int nearestIndex = -1;
  float minDifference = FLT_MAX;

  for (int i = 0; i < size; ++i) {
    float difference = fabs(readVoltage[i] - value);

    if (difference == 0) {
      // Exact match found
      return 100 - i;
    }

    if (difference < minDifference) {
      minDifference = difference;
      nearestIndex = i;
    }
  }

  // Nearest match found
  if (value < readVoltage[size - 1]) {
    return 0;
  } else {
    // Adjusted linear interpolation
    float decreaseFactor = 0.1;  // Adjust this factor to control the rate of decrease
    float x0 = readVoltage[nearestIndex];
    float x1 = readVoltage[nearestIndex + 1];
    float y0 = 100 - nearestIndex;
    float y1 = 100 - (nearestIndex + 1);

    // Ensure the result is not greater than the SoC at x0
    float resultFloat = max(y1, y0 - decreaseFactor * (x0 - value) * (y0 - y1) / (x0 - x1));

    // Ensure the result is not greater than the previous result
    int result = min(static_cast<int>(resultFloat), previousResult);

    // Ensure the result is within the range [0, 100]
    result = max(0, min(100, result));
    if(previousSoC>result){
      previousSoC=result;
    }else{
      return previousSoC;
    }

    // Update the previous result
    previousResult = result;



    return previousSoC;
  }
}
// I=V/R = 41mA
// Capacity = I/Time
