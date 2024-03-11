#include <EEPROM.h>

float voltage[] = { 7.17, 7.1721375, 7.172583, 7.132375, 7.133365, 7.13287, 7.13188, 7.131385, 7.01, 7.08188, 7.171692, 7.1730285, 7.170801, 7.1712465, 7.173474, 7.1739195, 7.174365, 7.134355, 7.13485, 7.13386, 7.083365, 7.08386, 7.08287, 7.082375, 6.96, 6.93, 7.084355, 7.08485, 6.91, 6.98386, 6.984355, 6.983365, 6.98287, 6.86, 6.982375, 6.98485, 6.98188, 6.84, 6.981385, 6.98089, 6.81, 6.79, 6.76, 6.74, 6.71, 6.69, 6.67, 6.64, 6.62, 6.59, 6.57, 6.54, 6.52, 6.49, 6.47, 6.45, 6.42, 6.4, 6.37, 6.35, 6.32, 6.3, 6.27, 6.25, 6.23, 6.2, 6.18, 6.15, 6.13, 6.1, 6.08, 6.05, 6.03, 6.01, 5.98, 5.96, 5.93, 5.91, 5.88, 5.86, 5.83, 5.81, 5.79, 5.76, 5.74, 5.71, 5.69, 5.66, 5.64, 5.62, 5.59, 5.57, 5.54, 5.52, 5.49, 5.47, 5.44, 5.42, 5.39, 5.37, 0.147712177};
int address = 0;

void clearEEPROM() {
  for (int i = 0; i < EEPROM.length(); i++) {
    EEPROM.write(i, 0);
  }
  Serial.println("EEPROM data successfully deleted");
}

void writeDataToEEPROM() {
  if (EEPROM.put(address, voltage)) {
    Serial.println("EEPROM data successfully written");
  } else {
    Serial.println("Error writing to EEPROM");
  }
}

void setup() {
  Serial.begin(9600);

  // Clear EEPROM before writing new data
  clearEEPROM();

  // Write data to EEPROM
  writeDataToEEPROM();

  float readVoltage[sizeof(voltage) / sizeof(voltage[0])];

  // Read data from EEPROM
  if (EEPROM.get(address, readVoltage)) {
    // Print the read values to the Serial Monitor
    for (int i = 0; i < sizeof(voltage) / sizeof(voltage[0]); i++) {
      Serial.print("Value at index ");
      Serial.print(i);
      Serial.print(": ");
      Serial.println(readVoltage[i], 4); // Adjust the precision as needed
    }

    // Print the size of the readVoltage array
    Serial.print("Size of readVoltage array: ");
    Serial.println(sizeof(readVoltage) / sizeof(readVoltage[0]));
  } else {
    Serial.println("Error reading from EEPROM");
  }
}

void loop() {
  
}
