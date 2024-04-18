#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "utils.h"  // Include your utility functions
#include "config.h" 
#include "sensors.h"
#include "wifi.h"
#include "server.h"
 

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

#define BT_CHARGE_FRAME_DELAY (-442)
#define BT_CHARGE_FRAME_WIDTH (32)
#define BT_CHARGE_FRAME_HEIGHT (32)
#define BT_CHARGE_FRAME_COUNT (sizeof(btChargeBitmapFrames) / sizeof(btChargeBitmapFrames[0]))
int btChargeFrame = 0;

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

void displayHealthCheckScreen(){
  display.clearDisplay();
  display.display();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(20, 0);
  display.println("Health Check!");

  
  if(isWifiConnected){
    display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(5, 20);
  display.print("WiFi:  ");
    display.println("OK");
  }else{
    display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(5, 20);
  display.print("WiFi:  ");
    display.println("X");
  }

  if(lipoHealth && tempSensorHealth){
     display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(5, 35);
  display.print("Sensors:  ");
    display.println("OK");
  }else{
     display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(5, 35);
  display.print("Sensors:  ");
    display.println("X");
  }

   
  if(isServerConnected){
     display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(5, 50);
  display.print("Server:  ");
    display.println("OK");
  }else{
     display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(5, 50);
  display.print("Server:  ");
    display.println("X");
  }
  

  
  display.display();
}


void displayInfoScreen(){
display.clearDisplay();


if(isCharging){
  display.drawBitmap(0, 30, btChargeBitmapFrames[btChargeFrame], BT_CHARGE_FRAME_WIDTH, BT_CHARGE_FRAME_HEIGHT, 1);
  // display.display();
}
else if(int(soc)>60){
  display.drawBitmap(0, 30, btMaxBitmapFrames[btChargeFrame], BT_CHARGE_FRAME_WIDTH, BT_CHARGE_FRAME_HEIGHT, 1);
  // display.display();
}
else if(int(soc)>40){
  display.drawBitmap(0, 30, btMidBitmapFrames[btChargeFrame], BT_CHARGE_FRAME_WIDTH, BT_CHARGE_FRAME_HEIGHT, 1);
  // display.display();
}
else if(int(soc)>1){
  display.drawBitmap(0, 30, btLowBitmapFrames[btChargeFrame], BT_CHARGE_FRAME_WIDTH, BT_CHARGE_FRAME_HEIGHT, 1);
  // display.display();
}
else if(int(soc)<1){
  display.drawBitmap(0, 30, btEmptyBitmapFrames[btChargeFrame], BT_CHARGE_FRAME_WIDTH, BT_CHARGE_FRAME_HEIGHT, 1);
  // display.display();
}else{

}
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(40, 4);
  display.println("BMS INFO");

  if(isWifiConnected){
     display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(40, 0);
  display.drawBitmap(112, 0, wifi, 16, 16, 2);
  }else{
    display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(40, 0);
  display.drawBitmap(112, 0, noWifi, 16, 16, 2);
  }
  
   
    char soc_str[20]; // Make sure this is large enough to hold the string representation
    char *soc_whole_str;
    char soc_decimal_str[3]; // For storing only two digits after the decimal point

    // Convert the float to a string
    sprintf(soc_str, "%.2f", soc); // "%.2f" ensures two digits after the decimal point

    // Split the string by the decimal point
    soc_whole_str = strtok(soc_str, ".");
    strcpy(soc_decimal_str, strtok(NULL, ".")); // Store only two digits after the decimal point

  
if(int(soc)>99){
 display.setTextSize(4);
  display.setTextColor(WHITE);
  display.setCursor(30, 25);
  display.print(soc_whole_str);
  display.print("%");

  // display.display();
}else{
  if(int(soc)<10){
       display.setTextSize(4);
  display.setTextColor(WHITE);
  display.setCursor(60, 35);
  display.print(soc_whole_str);

  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(80, 50);
  display.print("."); // Print with leading zero
  display.print(soc_decimal_str); // Print with leading zero
  display.print("%");
  // display.display();
  }else{
    display.setTextSize(3.9);
  display.setTextColor(WHITE);
  display.setCursor(47, 32);
  display.print(soc_whole_str);

  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(80, 39);
  display.print("."); // Print with leading zero
  display.print(soc_decimal_str); // Print with leading zero
  display.print("%");
  // display.display();
  }
}


display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(40, 0);
  display.drawBitmap(0, 0, cloudUpload, 16, 16, 2);
 
    display.setTextSize(1);
    display.setFont(NULL);
    display.setCursor(25, 16);
    display.print((int)temperature);
    display.print(" C");
    display.print(" | ");
    display.print(voltage);
    display.print(" V");
    // display.clearDisplay();
    display.display();

  btChargeFrame = (btChargeFrame + 8) % BT_CHARGE_FRAME_COUNT;
  // Serial.print(btChargeFrame);
  
  // delay(BT_CHARGE_FRAME_DELAY);
}   