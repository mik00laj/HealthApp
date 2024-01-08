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

  bool dataLed = false;
  bool sendTemperatureDataFlag = false;
  bool sendSaturationDataFlag = false;
  bool sendHeartbeatDataFlag = false;
  bool stopSendFlag = true;

  unsigned long currentTime = 0;  
  unsigned long savedTime = 0; 
  unsigned long interval = 5000; 
    
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

  void sendDataToServer(float temperatureC, float saturation, int heartbeat) {
    HTTPClient http;
    String postData;    
    String url; 
    // Dane do wysłania w formie JSON
    if (sendTemperatureDataFlag == true) { 
        url = "http://" + String(serverAddress) + ":" + String(serverPort) + "/esp/temperature-sensor";   
        postData = "{\"temperature\": " + String(temperatureC) + "}";
    } else if (sendHeartbeatDataFlag == true) {
        url = "http://" + String(serverAddress) + ":" + String(serverPort) + "/esp/puls-sensor";        
        postData = "{\"heartbeat\": " + String(heartbeat) + "}";
        
    } else if (sendSaturationDataFlag == true) {  
        url = "http://" + String(serverAddress) + ":" + String(serverPort) + "/esp/saturation-sensor";   
        postData = "{\"saturation\": " + String(saturation) + "}";
    }
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(postData);
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("HTTP Request failed. Error code: ");
      Serial.println(httpResponseCode);
    }
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
      digitalWrite(DS18B20_Led_On, LOW); 
      digitalWrite(DS18B20_Led_Off, HIGH);
    } 
    else {
      digitalWrite(DS18B20_Led_On, HIGH); 
      digitalWrite(DS18B20_Led_Off, LOW); 
    }

    //Pobieranie danych z czujnika tętna i pulsoksymetr MAX30102 
    MAX30102.sensorStartCollect();
    MAX30102.getHeartbeatSPO2();
    int saturation = MAX30102._sHeartbeatSPO2.SPO2;
    int heartbeat = MAX30102._sHeartbeatSPO2.Heartbeat;

    if (false == MAX30102.begin()) {
      digitalWrite(MAX30102_Led_On, LOW); 
      digitalWrite(MAX30102_Led_Off, HIGH); 
    }
    else {
      digitalWrite(MAX30102_Led_On, HIGH); 
      digitalWrite(MAX30102_Led_Off, LOW); 
    }

    if (WiFi.status() != WL_CONNECTED){
      digitalWrite(WiFi_Led_On, LOW); 
      digitalWrite(WiFi_Led_Off, HIGH);
    }
    else {
      digitalWrite(WiFi_Led_On, HIGH); 
      digitalWrite(WiFi_Led_Off, LOW); 
    }

    if (digitalRead(temperatureBtn) == LOW && stopSendFlag == true) {
      delay(20);
      dataLed = true;
      digitalWrite(SendDataLed, dataLed);
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
      sendTemperatureDataFlag = false;
      sendSaturationDataFlag = false;
      sendHeartbeatDataFlag = false;
      stopSendFlag = true;   
      while (digitalRead(stopBtn) == LOW);
      delay(20); 
    } 

    currentTime = millis();
    if (sendTemperatureDataFlag || sendSaturationDataFlag || sendHeartbeatDataFlag) {
      if (currentTime - savedTime >= interval) {
        savedTime = currentTime;
          sendDataToServer(temperatureC, saturation, heartbeat);
      }
    }  
  }
