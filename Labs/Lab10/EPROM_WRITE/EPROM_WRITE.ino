#include <EEPROM.h>

float voltage[] = { 7.2238,7.230178105263158,7.110709894736842,7.0464677894736845,7.0118665263157895,6.968885894736841,6.926078736842105,6.858195789473684,6.816292631578947,6.74785052631579,6.676162526315789,6.601025684210526,6.510009684210526,6.395815157894737,6.291491368421053,6.171397894736842,6.085201684210527,5.94137347368421,5.82121852631579,0.05};
float current[] = { 0.02275,0.022908734177215118,0.022591265822784812,0.02269430379746834,0.022592658227848103,0.023233164556962026,0.023043797468354398,0.02306886075949367,0.02280012658227846,0.022802911392405017,0.0230006329113924,0.02341240506329114,0.02326240506329114,0.0229699999999999,0.023057721518987342,0.023092531645569625,0.02269987341772152,0.02253,0.02242139240506329,0.022658101265822756,0.022372658227848098,0.022224936708860762,0.022379620253164555,0.022553670886075943,0.022227974683544306,0.02197,0.022393544303797468,0.021917088607594937,0.02225886075949367,0.021758354430379746,0.022370506329113932,0.021709620253164554,0.022170506329113923,0.021592658227848102,0.022086962025316455,0.021502151898734174,0.02196164556962026,0.021453417721518986,0.02148405063291139,0.021294683544303795,0.0215146835443038,0.021484050632911394,0.021353164556962023,0.021196962025316454,0.02097,0.02086,0.020812658227848092,0.021070253164556872,0.02087113924050629,0.020788987341772154,0.020665063291139242,0.020793164556962035,0.020591265822784817,0.0203099999999999,0.0202,0.02016518987341772,0.01998,0.02006088607594937,0.01994506329113924,0.019991012658227857,0.01953,0.01952721518987341,0.01933924050632904,0.01935037974683545,0.019161012658227842,0.019002278481012654,0.018795569620253163,0.018793797468354433,0.018743037974683543,0.01844367088607595,0.01831,0.0182,0.01809,0.018016202531645566,0.017826835443037974,0.017954936708860756,0.017548101265822784,0.01742,0.017279367088607594,0.0172};

int voltageAddress  = 0;
int currentAddress = 200;

void clearEEPROM() {
  Serial.println(EEPROM.length());
  for (int i = 0; i < EEPROM.length(); i++) {
    EEPROM.write(i, 0);
  }
  Serial.println("EEPROM data successfully deleted");
}

void writeDataToEEPROM() {
  if (EEPROM.put(voltageAddress, voltage)) {
    Serial.println("EEPROM voltage data successfully written");
  } else {
    Serial.println("Error writing to EEPROM");
  }
}

void writeCurrentDataToEEPROM() {
  if (EEPROM.put(currentAddress, current)) {
    Serial.println("EEPROM current data successfully written");
  } else {
    Serial.println("Error writing to EEPROM");
  }
}

void readVoltage(){
  float readVoltage[sizeof(voltage) / sizeof(voltage[0])];

  // Read data from EEPROM
  if (EEPROM.get(voltageAddress, readVoltage)) {
    // Print the read values to the Serial Monitor
    for (int i = 0; i < sizeof(voltage) / sizeof(voltage[0]); i++) {
      Serial.print("Voltage Value at index ");
      Serial.print(i);
      Serial.print(": ");
      Serial.println(readVoltage[i], 4); // Adjust the precision as needed
    }

    // Print the size of the readVoltage array
    Serial.print("Size of voltage array: ");
    Serial.println(sizeof(readVoltage) / sizeof(readVoltage[0]));
  } else {
    Serial.println("Error reading from EEPROM");
  }
}

void readCurrent(){
  float readCurrent[sizeof(current) / sizeof(current[0])];

  // Read data from EEPROM
  if (EEPROM.get(currentAddress, readCurrent)) {
    // Print the read values to the Serial Monitor
    for (int i = 0; i < sizeof(current) / sizeof(current[0]); i++) {
      Serial.print("Current Value at index ");
      Serial.print(i);
      Serial.print(": ");
      Serial.println(readCurrent[i], 4); // Adjust the precision as needed
    }

    // Print the size of the readCurrent array
    Serial.print("Size of current array: ");
    Serial.println(sizeof(readCurrent) / sizeof(readCurrent[0]));
  } else {
    Serial.println("Error reading current from EEPROM");
  }
}

void setup() {
  Serial.begin(9600);

  // Clear EEPROM before writing new data
  clearEEPROM();

  // Write data to EEPROM
  writeDataToEEPROM();
  writeCurrentDataToEEPROM();

  // Read and print data from EEPROM
  readVoltage();
  readCurrent();
}

void loop() {
  // Nothing to do here for now
}
