#include <EEPROM.h>
#include <float.h>
#include <Arduino.h>

#define FLT_MAX 3.4028235e38
int address = 0;
int previousResult = 100;

#define ARRAY_SIZE 101
float readVoltage[ARRAY_SIZE];

// Read data from EEPROM
void readDataFromEEPROM() {
  EEPROM.get(address, readVoltage);
}

int findIndex(float value, float readVoltage[], int size) {
  int nearestIndex = -1;
  float minDifference = FLT_MAX;

  for (int i = 0; i < size; ++i) {
    float difference = fabs(readVoltage[i] - value);

    if (difference == 0) {
      // Exact match found
      return 100 - i;
    }

    if (difference < minDifference) {
      minDifference = difference;
      nearestIndex = i;
    }
  }

  // Nearest match found
  if (value > readVoltage[0]) {
    return 100;
  } else if (value < readVoltage[size - 1]) {
    return 0;
  } else {
    // Adjusted linear interpolation
    float decreaseFactor = 0.1;  // Adjust this factor to control the rate of decrease
    float x0 = readVoltage[nearestIndex];
    float x1 = readVoltage[nearestIndex + 1];
    float y0 = 100 - nearestIndex;
    float y1 = 100 - (nearestIndex + 1);

    // Ensure the result is not greater than the SoC at x0
    float resultFloat = max(y1, y0 - decreaseFactor * (x0 - value) * (y0 - y1) / (x0 - x1));

    // Ensure the result is not greater than the previous result
    int result = min(static_cast<int>(resultFloat), previousResult);

    // Ensure the result is within the range [0, 100]
    result = max(0, min(100, result));

    // Update the previous result
    previousResult = result;

    return result;
  }
}

void setup() {
  Serial.begin(9600);

  // Read data from EEPROM
  readDataFromEEPROM();
  // Print the number of elements
  int numElements = sizeof(readVoltage) / sizeof(readVoltage[0]);
  Serial.print("Number of elements in the array");
  Serial.println(numElements);
}

void loop() {
  for (float inputValue = 7.4; inputValue >= 5.1; inputValue -= 0.01) {
    // With adjusted linear interpolation in findIndex method
    int interpolatedResult = findIndex(inputValue, readVoltage, ARRAY_SIZE);

    // Print the results
    Serial.print("Input Value: ");
    Serial.print(inputValue, 2);
    Serial.print(" | SoC Result (Interpolated): ");
    Serial.print(interpolatedResult);
    Serial.println();  // Move to the next line for the next iteration

    delay(200); // Delay for better readability, adjust as needed
  }
  previousResult = 100;
}