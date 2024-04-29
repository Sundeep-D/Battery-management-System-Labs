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
int voltageAddress = 0;
int currentAddress = 200;
int previousResult = 100;
int previousSoC = 100;
#define VOLTAGE_ARRAY_SIZE 20
#define CURRENT_ARRAY_SIZE 80
float readVoltage[VOLTAGE_ARRAY_SIZE];
float readCurrent[CURRENT_ARRAY_SIZE];

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
    + " | SoC: " + String(findHybridSoc(getOCV(V1,current),readCurrent,CURRENT_ARRAY_SIZE,readVoltage, VOLTAGE_ARRAY_SIZE))+"%";
    //findHybridSoc(float voltage_value, float current_value[], int current_size, float voltage_data[], int voltage_size);
    


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

void readVoltageDataFromEEPROM() {
  
    Serial.println("Reading Voltage data from EEPROM...");
    EEPROM.get(voltageAddress, readVoltage);
    int numElements = sizeof(readVoltage) / sizeof(readVoltage[0]);
    Serial.print("Number of voltage values read: ");
    Serial.println(numElements);
    for (int i = 0; i < numElements; i++) {
        Serial.print("Voltage at index ");
        Serial.print(i);
        Serial.print(": ");
        Serial.println(readVoltage[i], 4);
    }
}

void readCurrentDataFromEEPROM() {
    Serial.println("Reading Current data from EEPROM...");
    EEPROM.get(currentAddress, readCurrent);
    int numElements = sizeof(readCurrent) / sizeof(readCurrent[0]);
    Serial.print("Number of current values read: ");
    Serial.println(numElements);
    for (int i = 0; i < numElements; i++) {
        Serial.print("Current at index ");
        Serial.print(i);
        Serial.print(": ");
        Serial.println(readCurrent[i], 4);
    }
    
}

float getOCV(float V1,float current) {
    float current_A=current/1000; //Convert mA to A
    int R=5; //Take a average R observed in Lab05 
    return (V1+(current_A*R));
}



int findHybridSoc(float voltage_value, float current_value[], int current_size, float voltage_data[], int voltage_size) {
    int nearest_voltage_index = -1;
    float min_voltage_difference = FLT_MAX;

    // Find the nearest voltage value in the dataset
    for (int i = 0; i < voltage_size; ++i) {
        float voltage_difference = fabs(voltage_data[i] - voltage_value);

        if (voltage_difference == 0) {
            // Exact match found, return corresponding SoC
            return 100 - (i * 5); // Assuming each voltage interval represents 5% SoC
        }

        if (voltage_difference < min_voltage_difference) {
            min_voltage_difference = voltage_difference;
            nearest_voltage_index = i;
        }
    }

    // No exact match found, perform interpolation using nearest voltage values
    float voltage_x0 = voltage_data[nearest_voltage_index];
    float voltage_x1 = voltage_data[nearest_voltage_index + 1];
    float soc_x0 = 100 - (nearest_voltage_index * 5);
    float soc_x1 = 100 - ((nearest_voltage_index + 1) * 5);

    // Perform linear interpolation
    float interpolated_soc = soc_x0 + ((voltage_value - voltage_x0) / (voltage_x1 - voltage_x0)) * (soc_x1 - soc_x0);

    // Approximate SoC based on current value
    int soc_approximation = static_cast<int>(interpolated_soc);

    // If the current value is within the array bounds, use it to adjust SoC approximation
    if (soc_approximation >= 0 && soc_approximation < current_size) {
        // Adjust SoC approximation based on current value
        soc_approximation -= static_cast<int>(current_value[soc_approximation] * 100);
    }

    // Ensure the result is within the range [0, 100]
    int hybrid_soc = max(0, min(100, soc_approximation));
    if(previousSoC>hybrid_soc){
      previousSoC=hybrid_soc;
    }else{
      return previousSoC;
    }

    // Update the previous result
    previousResult = hybrid_soc;



    return previousSoC;

    // return hybrid_soc;
}


float interpolateCurrent(float voltage_value, float current_value[], int current_size, float voltage_data[], int voltage_size) {
    // Find the nearest voltage values in the dataset
    int nearest_voltage_index = -1;
    float min_voltage_difference = FLT_MAX;
    
    for (int i = 0; i < voltage_size; ++i) {
        float voltage_difference = fabs(voltage_data[i] - voltage_value);
        
        if (voltage_difference == 0) {
            // Exact match found
            return current_value[i];
        }
        
        if (voltage_difference < min_voltage_difference) {
            min_voltage_difference = voltage_difference;
            nearest_voltage_index = i;
        }
    }
    
    // Perform linear interpolation between the nearest voltage values
    float voltage_x0 = voltage_data[nearest_voltage_index];
    float voltage_x1 = voltage_data[nearest_voltage_index + 1];
    float current_y0 = current_value[nearest_voltage_index];
    float current_y1 = current_value[nearest_voltage_index + 1];
    
    // Calculate interpolated current value
    float interpolated_current = current_y0 + (voltage_value - voltage_x0) * (current_y1 - current_y0) / (voltage_x1 - voltage_x0);
    
    return interpolated_current;
}

void clearEEPROM() {
  Serial.println(EEPROM.length());
  for (int i = 0; i < EEPROM.length(); i++) {
    EEPROM.write(i, 0);
  }
  Serial.println("EEPROM data successfully deleted");
}



// I=V/R = 41mA
// Capacity = I/Time
