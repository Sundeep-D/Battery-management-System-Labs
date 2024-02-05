// myFunctions.h
#ifndef MY_FUNCTIONS_H
#define MY_FUNCTIONS_H

#include <Arduino.h>  
#include <SD.h>

void prepareSdCard();
int addNumbers(int a, int b);
File createLogFile(String fileName, File logFile);
File createCsvFile(String fileName,File csvFile);
void writeData(File logFile,File csvFile,float V1,float V2);
long generateTimestamp();
float getVoltageReading(int analogPin);
void deleteFile(String fileName);
float calculateCurrent(float voltage);
float calculateCapacity(float current, long time);

#endif