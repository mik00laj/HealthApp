#include <OneWire.h>
#include <DallasTemperature.h>
#include "Wire.h"
#include "DFRobot_BloodOxygen_S.h"
#include <WiFi.h>
#include <HTTPClient.h>

#define ONE_WIRE_BUS 5
#define I2C_COMMUNICATION
#define DS18B20_Led_On 2
#define DS18B20_Led_Off 15
#define MAX30102_Led_On 4
#define MAX30102_Led_Off 0
#define WiFi_Led_On 17
#define WiFi_Led_Off 16 

#ifdef I2C_COMMUNICATION
  #define I2C_ADDRESS 0x57
  DFRobot_BloodOxygen_S_I2C MAX30102(&Wire, I2C_ADDRESS);
#else
  DFRobot_BloodOxygen_S_HardWareUart MAX30102(1, 16);
#endif

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

String ConnectedDS18B20 = "Czujnik temperatury DS18B20 podłączony.";
String ConnectedMAX30102 = "Czujnik tętna i pulsoksymetr MAX30102 podłączony ";
String notConnectedDS18B20 = "Brak czujnika temperatury DS18B20. Sprawdź podłączenie.";
String notConnectedMAX30102 = "Brak czujnika tętna i pulsoksymetr MAX30102. Sprawdź podłączenie.";

const char* ssid = "Domek";
const char* password = "Awruk123";
const char* serverAddress = "192.168.0.14";
const int serverPort = 4001;


void initializeDS18B20() {
  // Inizcjalizacja czujnika temperatury DS18B20
  sensors.begin();
  sensors.requestTemperatures();
  
  float temperatureC = sensors.getTempCByIndex(0);
  while (temperatureC == -127) {
    Serial.println(notConnectedDS18B20);
    digitalWrite(DS18B20_Led_On, LOW); 
    digitalWrite(DS18B20_Led_Off, HIGH); 
    delay(1000);
    temperatureC = sensors.getTempCByIndex(0);
  }
  Serial.println(ConnectedDS18B20);
  digitalWrite(DS18B20_Led_On, HIGH); 
  digitalWrite(DS18B20_Led_Off, LOW); 

}

void initializeMAX30102() {
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

void connectToWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.println("\nŁączenie z sięcią ..");
 
    while(WiFi.status() != WL_CONNECTED){
        Serial.print(".");
        digitalWrite(WiFi_Led_On, LOW); 
        digitalWrite(WiFi_Led_Off, HIGH); 

    }
    digitalWrite(WiFi_Led_On, HIGH); 
    digitalWrite(WiFi_Led_Off, LOW); 
    Serial.print("\nPołączono z siecią Wi-Fi: ");
    Serial.println(ssid);
    Serial.print("Local ESP32 IP: ");
    Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(9600);
  //LED
  pinMode(DS18B20_Led_On, OUTPUT);
  pinMode(DS18B20_Led_Off, OUTPUT);
  pinMode(MAX30102_Led_On, OUTPUT);
  pinMode(MAX30102_Led_Off, OUTPUT);
  pinMode(WiFi_Led_On, OUTPUT);
  pinMode(WiFi_Led_Off, OUTPUT);
  

  delay(100); 
  initializeDS18B20();
  initializeMAX30102();
  connectToWiFi();
}

void loop() {
  //Pobieranie danych z czujnika temperatury DS18B20 
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);

  if (temperatureC == -127) {
    Serial.println(notConnectedDS18B20);
    digitalWrite(DS18B20_Led_On, LOW); 
    digitalWrite(DS18B20_Led_Off, HIGH);
    delay(1000);
  } 
  else {
    digitalWrite(DS18B20_Led_On, HIGH); 
    digitalWrite(DS18B20_Led_Off, LOW); 

    Serial.print("Zmierzona temperatura: ");
    Serial.print(temperatureC);
    Serial.println("°C");
  }
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
  else {
    digitalWrite(MAX30102_Led_On, HIGH); 
    digitalWrite(MAX30102_Led_Off, LOW); 

    Serial.print("SPO2= ");
    Serial.print(saturation);
    Serial.println("%");

    Serial.print("BPM= ");
    Serial.print(heartbeat);
    Serial.println("");
  }

  if (WiFi.status() != WL_CONNECTED){
    Serial.print("\n Nie połączono z siecią Wi-Fi: ");
    digitalWrite(WiFi_Led_On, LOW); 
    digitalWrite(WiFi_Led_Off, HIGH);
    delay(1000); 
  }
  else {
    digitalWrite(WiFi_Led_On, HIGH); 
    digitalWrite(WiFi_Led_Off, LOW); 
  }

}
