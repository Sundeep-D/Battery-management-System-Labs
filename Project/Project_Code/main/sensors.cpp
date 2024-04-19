#include "sensors.h"
#include "MAX17043.h"
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

SFE_MAX1704X lipo;

double voltage = 0;
double soc = 0;
bool alert = false; 
bool isCharging = false;
float temperature;
bool previousState = false;
bool lipoHealth = false;
bool tempSensorHealth=false;

// Function to initialize sensor pins
void initializeSensorPins() {
    pinMode(SENSOR_PIN, INPUT);
    pinMode(RELAY_PIN, OUTPUT);
}

void initializeVariables() {
     voltage = 0;
 soc = 0;
 alert = false; 
 isCharging = false;
 temperature;
 previousState = false;
}

void initializeTemperatureSensor() {
  sensors.begin();
  if(sensors.getTempCByIndex(0) != DEVICE_DISCONNECTED_C){
    tempSensorHealth=true;
  }else{
    tempSensorHealth=false;
  }
}

// Function to read sensor state
void readChargingState() {
  bool currentState = digitalRead(SENSOR_PIN);
  
  // if(currentState != previousState) { // Check if state has changed
  //   lipo.quickStart(); // Execute quickStart() only when state changes
  //   previousState = currentState; // Update previous state
  // }
  
  isCharging = currentState; // Update current state
}

void readTemperature() {
  sensors.requestTemperatures(); // Send the command to get temperatures
  
  if(sensors.getTempCByIndex(0) != DEVICE_DISCONNECTED_C) {
    temperature = sensors.getTempCByIndex(0);
  } else {
    Serial.println("Error: Could not read temperature data");
  }
}
void initializeFuelGauge() {
  // FuelGauge.begin();
  static bool initialized = false; // Static variable to track initialization status
  static bool retryInProgress = false; // Static variable to track retry in progress
  static unsigned long lastRetryTime = 0; // Variable to store the time of the last retry
  static int retryCount = 0; // Initialize retry count
  static unsigned long retryInterval = 1000; // Retry interval in milliseconds
  static int maxRetries = 5000;


  // If initialization is already done, return immediately
  if (initialized) {
    if (!FuelGauge.begin()) {
      initialized = false; // Set initialized flag to true
      lipoHealth = false;
    }
    return;
  }

  // If retry is in progress, check if retry interval has elapsed
  if (retryInProgress && (millis() - lastRetryTime < retryInterval)) {
    return;
  }

  // If retry interval has elapsed, reset retry in progress flag
  retryInProgress = false;

  // Attempt to initialize the fuel gauge
  if (FuelGauge.begin()) { // If initialization is successful
    Serial.println(F("MAX17043 detected."));
    FuelGauge.quickstart();
    initialized = true; // Set initialized flag to true
    lipoHealth = true;
  } else {
    lipoHealth = false;
    // If initialization fails, check if maximum retries reached
    if (retryCount >= maxRetries) {
      Serial.println(F("MAX17043 not detected after maximum retries. Please check wiring."));
      while (1); // Freeze the sketch
    } else {
      // Retry initialization
      // Serial.print(F("MAX17043 not detected. Retrying... (Retry "));
      // Serial.print(retryCount + 1); // Print retry count (1-indexed)
      // Serial.println(F(")"));
      delay(1000); // Delay before retrying
      retryInProgress = true; // Set retry in progress flag
      lastRetryTime = millis(); // Update last retry time
      retryCount++; // Increment retry count
    }
  }
}

void readFuelGaugeData() {
  // lipo.quickStart();
  voltage = FuelGauge.voltage() / 1000;
  soc = FuelGauge.percent();
  if (soc > 100) {
    soc = 100; // Set SOC value to 100
  }
  // alert = lipo.getAlert();
}

void circuitShutdown(bool shutdown){
  if(shutdown){
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Circuit SHUTDOWN enabled");
  }else{
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Circuit SHUTDOWN disabled");
  }
}
// Function to calculate current capacity based on voltage and SoC
float calculateCapacity(float voltage, float soc) {
    // Rated capacity of the LiPo battery (in mAh)
    float ratedCapacity = 250.0;  // Change this value to match your battery's rated capacity

    // Convert SoC to fraction
    float socFraction = soc / 100.0;

    // Calculate available charge (in mAh)
    float availableCharge = ratedCapacity * socFraction;

    return availableCharge;
}