#ifndef WIFI_H
#define WIFI_H

#include <WiFi.h>
#include "config.h" // Include your config file for Wi-Fi credentials

extern bool isWifiConnected;

void connectToWiFi();
void checkWifiConnection();

#endif