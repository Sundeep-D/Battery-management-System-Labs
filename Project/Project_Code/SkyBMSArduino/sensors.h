#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <SparkFun_MAX1704x_Fuel_Gauge_Arduino_Library.h>


#define SENSOR_PIN 7 // Pin to detect charging in the Battery module
#define ONE_WIRE_BUS 2 //Pin to read temperature data
#define ALERT_THRESHOLD 20 // Set alert threshold to 20% for LIPO Fuel guage
#define RELAY_PIN 8 // Pin to detect charging in the Battery module

extern double voltage;
extern double soc;
extern bool alert;
extern bool isCharging;
extern float temperature;
extern bool lipoHealth;
extern bool tempSensorHealth;

// Function prototypes
void initializeSensorPins();
void readChargingState();
void initializeTemperatureSensor();
void readTemperature();
void initializeFuelGauge();
void readFuelGaugeData();
void initializeVariables();
void circuitShutdown(bool shutdown);
float calculateCapacity(float voltage, float soc);

#endif