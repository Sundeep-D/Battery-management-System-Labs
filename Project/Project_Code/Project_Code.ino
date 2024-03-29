

#include <Wire.h> // Needed for I2C

#include <SparkFun_MAX1704x_Fuel_Gauge_Arduino_Library.h> 
SFE_MAX1704X lipo; // Defaults to the MAX17043


double voltage = 0; // Variable to keep track of LiPo voltage
double soc = 0; // Variable to keep track of LiPo state-of-charge (SOC)
bool alert; // Variable to keep track of whether alert has been triggered

const int chargingIndicatorPin = 2; // Digital pin connected to TP4056 charging indicator LED



void setup()
{
    Serial.begin(115200); // Start serial, to output debug data
    while (!Serial)
        ; //Wait for user to open terminal
    Serial.println(F("MAX17043 Example"));

    pinMode(chargingIndicatorPin, INPUT);

    Wire.begin();

    // lipo.enableDebugging(); // Uncomment this line to enable helpful debug messages on Serial

    // Set up the MAX17043 LiPo fuel gauge:
    bool lipoDetected = false;
    while (!lipoDetected) {
        if (lipo.begin()) {
            lipoDetected = true;
        } else {
            Serial.println(F("Battery not found"));
            delay(2000); // Delay for 2 seconds before retrying
        }
    }

    // Quick start restarts the MAX17043 in hopes of getting a more accurate
    // guess for the SOC.
    lipo.quickStart();

    // We can set an interrupt to alert when the battery SoC gets too low.
    // We can alert at anywhere between 1% - 32%:
    lipo.setThreshold(20); // Set alert threshold to 20%.
}

void loop()
{
    // lipo.getVoltage() returns a voltage value (e.g. 3.93)
    double voltage = lipo.getVoltage();
    // lipo.getSOC() returns the estimated state of charge (e.g. 79%)
    double soc = lipo.getSOC();
    // lipo.getAlert() returns a 0 or 1 (0=alert not triggered)
    bool alert = lipo.getAlert();

    // Print the variables:
    // Serial.print("Voltage: ");
    Serial.print(voltage);  // Print the battery voltage
    Serial.print(" V");

    Serial.print(" | ");
    Serial.print(soc); // Print the battery state of charge
    Serial.print(" %");

     int chargingStatus = digitalRead(chargingIndicatorPin);
     Serial.print(" | ");
  if (chargingStatus == HIGH) {
    lipo.begin();
    lipo.quickStart();
    Serial.print("charging");
  } else {
    lipo.begin();
    lipo.quickStart();
    Serial.print("not charging");
  }

Serial.print(" | ");
Serial.println("");
    delay(500); // Delay for stability and readability
}