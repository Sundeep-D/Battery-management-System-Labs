// myFunctions.h
#ifndef MY_FUNCTIONS_H
#define MY_FUNCTIONS_H

#include <Arduino.h>  
#include <SD.h>

void prepareSdCard();
int addNumbers(int a, int b);
File createLogFile(String fileName, File logFile);
String getFormattedTimestamp(float voltage);
long generateTimestamp();
float getVoltageReading(int analogPin);
void deleteLogFile(String fileName);

#endif