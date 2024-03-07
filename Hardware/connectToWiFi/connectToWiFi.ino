#include <WiFi.h>
#include <HTTPClient.h>

#define WiFi_Led_On 17
#define WiFi_Led_Off 16 

const char* ssid = "XXX";
const char* password = "XXX";
const char* serverAddress = "XXX.XX.X.XX";
const int serverPort = 0;

void setup() {
  Serial.begin(9600);
  //LED
  pinMode(WiFi_Led_On, OUTPUT);
  pinMode(WiFi_Led_Off, OUTPUT);

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

void loop() {
  if (WiFi.status() != WL_CONNECTED){
    Serial.print("\n Nie połączono z siecią Wi-Fi: ");
    digitalWrite(WiFi_Led_On, LOW); 
    digitalWrite(WiFi_Led_Off, HIGH);
    delay(1000); 
  }else{
    digitalWrite(WiFi_Led_On, HIGH); 
    digitalWrite(WiFi_Led_Off, LOW); 
    delay(1000);
  }
}

