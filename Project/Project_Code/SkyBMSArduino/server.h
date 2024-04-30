#ifndef SERVER_H
#define SERVER_H

#include <WiFi.h>
#include "config.h" 
#include "WiFiS3.h"


extern bool isServerConnected;

void connectToServer();
void sendDataToServer();
void readDataFromServer();

#endif
