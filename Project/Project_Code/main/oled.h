// display.h

#ifndef DISPLAY_H
#define DISPLAY_H

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "oled-utils.h"
#include "config.h" 

// Function prototypes
void initializeDisplay();
void testdrawcircle();
void displayLogo();
void displayWifiConnectScreen();
void clearDisplay();

#endif  // DISPLAY_H