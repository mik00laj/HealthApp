#include "Wire.h"
#include "DFRobot_BloodOxygen_S.h"

#define I2C_COMMUNICATION
#define MAX30102_Led_On 4
#define MAX30102_Led_Off 0
#ifdef I2C_COMMUNICATION
  #define I2C_ADDRESS 0x57
  DFRobot_BloodOxygen_S_I2C MAX30102(&Wire, I2C_ADDRESS);
#else
  DFRobot_BloodOxygen_S_HardWareUart MAX30102(1, 16);
#endif

String ConnectedMAX30102 = "Czujnik tętna i pulsoksymetr MAX30102 podłączony ";
String notConnectedMAX30102 = "Brak czujnika tętna i pulsoksymetr MAX30102. Sprawdź podłączenie.";

void setup(){
  Serial.begin(9600);
  //LED
  pinMode(MAX30102_Led_On, OUTPUT);
  pinMode(MAX30102_Led_Off, OUTPUT);
    
 //Inizcjalizacja czujnika tętna i pulsoksymetr MAX30102
  Wire.begin();
   while (false == MAX30102.begin())
  {
    Serial.println(notConnectedMAX30102);
    digitalWrite(MAX30102_Led_On, LOW); 
    digitalWrite(MAX30102_Led_Off, HIGH); 
    delay(1000);
  }
  Serial.println(ConnectedMAX30102);
  digitalWrite(MAX30102_Led_On, HIGH); 
  digitalWrite(MAX30102_Led_Off, LOW); 
}

void loop()
{
  //Pobieranie danych z czujnika tętna i pulsoksymetr MAX30102 
  MAX30102.sensorStartCollect();
  MAX30102.getHeartbeatSPO2();

  int saturation = MAX30102._sHeartbeatSPO2.SPO2;
  int heartbeat = MAX30102._sHeartbeatSPO2.Heartbeat;

  if (false == MAX30102.begin()) {
    Serial.println(notConnectedMAX30102);
    digitalWrite(MAX30102_Led_On, LOW); 
    digitalWrite(MAX30102_Led_Off, HIGH); 
    delay(1000);
  }
  else{
    digitalWrite(MAX30102_Led_On, HIGH); 
    digitalWrite(MAX30102_Led_Off, LOW); 

    Serial.print("SPO2= ");
    Serial.print(saturation);
    Serial.println("%");

    Serial.print("BPM= ");
    Serial.print(heartbeat);
    Serial.println("");
  }
  
  Serial.println("");
  delay(1000);
  }
