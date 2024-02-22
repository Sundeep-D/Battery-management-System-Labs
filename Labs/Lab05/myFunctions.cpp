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

unsigned long relay_start_time = 0; // Variable to store the start time for relay timer
unsigned long relay_elapsed_time = 0; // Variable to store the elapsed time for relay timer
const int relayPin = 7;
String circuit_name="Closed";
unsigned long min30 = ((30UL * 60) * 1000);
unsigned long min40 = ((40UL * 60) * 1000);



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
        csvFile.println("Timestamp,Voltage1,Circuit");
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
    + " | V1: " + String(V1)+"V" + " | Circuit: " + String(circuit_name);

    String formattedStringForLog = 
    String(currentTime) 
    +"," 
    + String(V1)
    +"," 
    + String(circuit_name);

    String formattedStringForCsv = 
    String(currentTime) 
    +"," 
    + String(V1)
    +"," 
    + String(circuit_name);
    

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

void relayTimer(){
    relay_elapsed_time = millis() - relay_start_time; // Calculate elapsed time for relay timer

    if (relay_elapsed_time <= min30) {  
        Serial.println("Closed circuit reading..." + String((relay_elapsed_time / 60000)) + "min" + "(" + String(relay_elapsed_time) + ")");
        digitalWrite(relayPin, LOW);
        circuit_name = "Closed";
    } else if (relay_elapsed_time <= min40) {  
        Serial.println("Open circuit reading..." + String((relay_elapsed_time / 60000)) + "min" + "(" + String(relay_elapsed_time) + ")");
        digitalWrite(relayPin, HIGH);
        circuit_name = "Open";
    } else {
        // Reset the relay timer
        relay_start_time = millis();
    }
}