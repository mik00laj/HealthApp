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
  #define SendDataLed 18
  #define temperatureBtn 26
  #define heartbeatBtn 25
  #define saturationBtn 33
  #define stopBtn 32

  bool dataLed = false;
  bool sendTemperatureDataFlag = false;
  bool sendSaturationDataFlag = false;
  bool sendHeartbeatDataFlag = false;
  bool stopSendFlag = true;
  int measureTemperatureId = 0;
  int measureSaturationId = 0;
  int measureHeartbeatId = 0;
  int measure = 0;
  unsigned long currentTime = 0;  // Zmienna do przechowywanai aktualnego czasu 
  unsigned long savedTime = 0; // Zmienna do przechowywania czasu ostatniego uruchomienia części kodu
  unsigned long interval = 1000; // wysyłanie danych co 1s 

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

  String postData;    // Dane do wysłania na serwer
  String url;         // Adres URL serwera
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

  void sendDataToServer(float temperatureC, float saturation, int heartbeat, int measureTemperatureId, int measureSaturationId, int measureHeartbeatId) {
    HTTPClient http;
    // Dane do wysłania w formie JSON
    if (sendTemperatureDataFlag == true) { 
        url = "http://" + String(serverAddress) + ":" + String(serverPort) + "/esp/temperature-sensor";   
        postData = "{\"measureId\": " + String(measureTemperatureId) + ", \"measure\": " + String(measure) + ", \"temperature\": " + String(temperatureC) + "}";
    } else if (sendHeartbeatDataFlag == true) {
        url = "http://" + String(serverAddress) + ":" + String(serverPort) + "/esp/puls-sensor";        
        postData = "{\"measureId\": " + String(measureTemperatureId) + ", \"measure\": " + String(measure) + ", \"heartbeat\": " + String(heartbeat) + "}";
        
    } else if (sendSaturationDataFlag == true) {  
        url = "http://" + String(serverAddress) + ":" + String(serverPort) + "/esp/saturation-sensor";   
        postData = "{\"measureId\": " + String(measureSaturationId) + ", \"measure\": " + String(measure) + ", \"saturation\": " + String(saturation) + "}";
    }

    // Rozpoczęcie połączenia HTTP
    http.begin(url);
    // Ustawienie nagłówków
    http.addHeader("Content-Type", "application/json");
    // Wysłanie danych POST na serwer
    int httpResponseCode = http.POST(postData);
    // Sprawdzenie odpowiedzi serwera
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("HTTP Request failed. Error code: ");
      Serial.println(httpResponseCode);
    }
    // Zamknięcie połączenia HTTP
    http.end();
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
    pinMode(SendDataLed, OUTPUT);
    
    //BTN
    pinMode(temperatureBtn, INPUT_PULLUP);
    pinMode(saturationBtn, INPUT_PULLUP);
    pinMode(heartbeatBtn, INPUT_PULLUP);
    pinMode(stopBtn, INPUT_PULLUP);

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

      // Serial.print("Zmierzona temperatura: ");
      // Serial.print(temperatureC);
      // Serial.println("°C");
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

      // Serial.print("SPO2= ");
      // Serial.print(saturation);
      // Serial.println("%");

      // Serial.print("BPM= ");
      // Serial.print(heartbeat);
      // Serial.println("");
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

    if (digitalRead(temperatureBtn) == LOW && stopSendFlag == true) {
      delay(20);
      dataLed = true;
      digitalWrite(SendDataLed, dataLed);
      measureTemperatureId = measureTemperatureId + 1;
      sendTemperatureDataFlag = true;   
      sendSaturationDataFlag = false;
      sendHeartbeatDataFlag = false;
      stopSendFlag = false; 
      while (digitalRead(temperatureBtn) == LOW);
      delay(20); 
    }

    if (digitalRead(saturationBtn) == LOW && stopSendFlag == true) {
      delay(20);
      dataLed = true;
      digitalWrite(SendDataLed, dataLed);
      measureSaturationId = measureSaturationId + 1;
      sendTemperatureDataFlag = false;
      sendSaturationDataFlag = true;    
      sendHeartbeatDataFlag = false;
      stopSendFlag = false;     
      while (digitalRead(saturationBtn) == LOW);
      delay(20); 
    }

    if (digitalRead(heartbeatBtn) == LOW && stopSendFlag == true) {
      delay(20);
      dataLed = true;
      digitalWrite(SendDataLed, dataLed);
      measureHeartbeatId = measureHeartbeatId + 1;        
      sendTemperatureDataFlag = false;
      sendSaturationDataFlag = false;
      sendHeartbeatDataFlag = true;
      stopSendFlag = false;     
      while (digitalRead(heartbeatBtn) == LOW);
      delay(20); 
    }

  if (digitalRead(stopBtn) == LOW && stopSendFlag == false) {
      delay(20);
      dataLed = false;
      digitalWrite(SendDataLed, dataLed);
      measure = 0;
      sendTemperatureDataFlag = false;
      sendSaturationDataFlag = false;
      sendHeartbeatDataFlag = false;
      stopSendFlag = true;   
      while (digitalRead(stopBtn) == LOW);
      delay(20); 
    } 

    currentTime = millis(); // Pobierz liczbę milisekund od startu
    if (sendTemperatureDataFlag || sendSaturationDataFlag || sendHeartbeatDataFlag) {
      if (currentTime - savedTime >= interval) {
        savedTime = currentTime;  // Zapisz bieżący czas
          sendDataToServer(temperatureC, saturation, heartbeat, measureTemperatureId, measureSaturationId, measureHeartbeatId);
          measure = measure + 1;
      }
    }  
  }
