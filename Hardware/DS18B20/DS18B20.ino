#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 5
#define DS18B20_Led_On 2
#define DS18B20_Led_Off 15
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

String ConnectedDS18B20 = "Czujnik temperatury DS18B20 podłączony.";
String notConnectedDS18B20 = "Brak czujnika temperatury DS18B20. Sprawdź podłączenie.";

void setup() {
  Serial.begin(9600);
  //LED
  pinMode(DS18B20_Led_On, OUTPUT);
  pinMode(DS18B20_Led_Off, OUTPUT);
  delay(100); 

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

void loop() {
  //Pobieranie danych z czujnika temperatury DS18B20 
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0);
  float temperatureF = sensors.getTempFByIndex(0);
  float temperatureK = temperatureC + 273.15; 

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
    Serial.print("Zmierzona temperatura: ");
    Serial.print(temperatureF);
    Serial.println("°F");
    Serial.print("Zmierzona temperatura: ");
    Serial.print(temperatureK);
    Serial.println("K");
  }
  
  Serial.println("");
  delay(1000);
}