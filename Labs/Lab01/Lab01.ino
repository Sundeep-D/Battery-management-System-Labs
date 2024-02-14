// Define analog input
#define ANALOG_IN_PIN A0
float adc_voltage = 0.0;
float in_voltage = 0.0;
float R1 = 30000.0;
float R2 = 7500.0; 
float ref_voltage = 5.0;
int adc_value = 0;
 
void setup(){
  Serial.begin(9600);
}
 
void loop(){
  adc_value = analogRead(ANALOG_IN_PIN);
  adc_voltage  = (adc_value * ref_voltage) / 1024.0;
  in_voltage = adc_voltage*(R1+R2)/R2;
  Serial.print("V = ");
  Serial.println(in_voltage, 2);
  delay(500);
}