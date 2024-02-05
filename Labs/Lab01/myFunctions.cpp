#include "myFunctions.h"

unsigned long startTime;
float adc_voltage = 0.0;
float in_voltage = 0.0;
float R1 = 30000.0;
float R2 = 7500.0;
float ref_voltage = 5.0;
int adc_value = 0;
int SD_PIN=10;

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
    Serial.println("Creating " + fileName);
    logFile = SD.open(fileName, FILE_WRITE);

    if (logFile) {
        Serial.println("==========================");
        Serial.println("|  Timestamp  | SoC (V)  |");
        Serial.println("==========================");
        logFile.close();
        return logFile;
    } else {
        Serial.println("Error opening the file " + fileName);
        return logFile;
    }
}

String getFormattedTimestamp(float voltage) {
    unsigned long currentMillis = millis();
    String formattedString = String(generateTimestamp()) + "        |      " + String(voltage);

    String formattedStringForLog = String(generateTimestamp()) + "," + String(voltage);

    Serial.println(formattedString);
    return formattedStringForLog;
}

long generateTimestamp() {
    unsigned long currentTime = millis();
    unsigned long elapsedTime = currentTime - startTime;
    return elapsedTime;
}

float getVoltageReading(int analogPin) {
    adc_value = analogRead(analogPin);
    adc_voltage = (adc_value * ref_voltage) / 1024.0;
    in_voltage = adc_voltage * (R1 + R2) / R2;

    return in_voltage;
}

void deleteLogFile(String fileName){

    if (!SD.begin(SD_PIN)) {
    Serial.println("SD card not found!");
    while (1);
  }
  Serial.print("Deleting file: ");
  Serial.println(fileName);

  if (SD.remove(fileName)) {
    Serial.println("File deleted successfully.");
  } else {
    Serial.println("Error deleting file.");
  }
}

// I=V/R = 41mA
// Capacity = I/Time
