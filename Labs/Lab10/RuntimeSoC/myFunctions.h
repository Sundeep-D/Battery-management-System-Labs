// myFunctions.h
#ifndef MY_FUNCTIONS_H
#define MY_FUNCTIONS_H
#include <EEPROM.h>
#include <Arduino.h>  
#include <SD.h>

void prepareSdCard();
int addNumbers(int a, int b);
File createLogFile(String fileName, File logFile);
File createCsvFile(String fileName,File csvFile);
void writeData(float V1,float V2);
long generateTimestamp();
float getVoltageReading(int analogPin);
void deleteFile(String fileName);
float calculateCurrent(float voltage1,float voltage2);
float calculateCapacity(float current, long time);
void readVoltageDataFromEEPROM();
void readCurrentDataFromEEPROM();
float getOCV(float voltage1,float current);
void clearEEPROM();
int findHybridSoc(float voltage_value, float current_value[], int current_size, float voltage_data[], int voltage_size);
float interpolateCurrent(float voltage_value, float current_value[], int current_size, float voltage_data[], int voltage_size);
#endif