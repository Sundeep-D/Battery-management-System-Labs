#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "utils.h"  // Include your utility functions
#include "config.h" 
 

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C  
#define SSD1306_NO_SPLASH
#include "oled-utils.h" 


#define WIFI_FRAME_DELAY (5)
#define WIFI_FRAME_WIDTH (32)
#define WIFI_FRAME_HEIGHT (32)
#define WIFI_FRAME_COUNT (sizeof(wifiBitmapFrames) / sizeof(wifiBitmapFrames[0]))
int wifiFrame = 0;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void initializeDisplay(){
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("Display error - SSD1306 allocation failed"));
    while (1);
  }
   display.clearDisplay();
}

void testdrawcircle() {
  display.clearDisplay();

  for(int16_t i=0; i<max(display.width(),display.height())/2; i+=2) {
    display.drawCircle(display.width()/2, display.height()/2, i, SSD1306_WHITE);
    display.display();
    delay(1);
  }

  delay(2000);
}

void clearDisplay(){
  display.clearDisplay();
  display.display();
}

void displayLogo() {
  
 display.drawBitmap(0, 0, skyBmsLogo, 128, 64, WHITE);
display.display();
}

void displayWifiConnectScreen(){
  Serial.print("Loading wifi screen");
display.clearDisplay();
  display.drawBitmap(0, 23, wifiBitmapFrames[wifiFrame], WIFI_FRAME_WIDTH, WIFI_FRAME_HEIGHT, 1);
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("Create WiFi Hotspot");

  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(40, 25);
  display.print("SSID: ");
  display.println(WIFI_SSID);

  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(40, 45);
  display.print("Pass: ");
  display.println(WIFI_PASSWORD);
  display.display();
  wifiFrame = (wifiFrame + 1) % WIFI_FRAME_COUNT;
  
  delay(WIFI_FRAME_DELAY);
}