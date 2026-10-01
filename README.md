# HealthApp

HealthApp is a full-stack health parameter monitoring system that covers the
whole data path from biomedical sensors, through a REST API and a cloud
database, to an interactive web dashboard. An ESP32 microcontroller reads
body temperature (DS18B20) and heart rate with blood saturation (MAX30102),
and sends the measurements over Wi-Fi to an Express.js server, which stores
them in MongoDB Atlas. The Angular single-page application then presents the
collected data as summary tiles, charts and tables, classifies each result and lets the user browse
the measurement history for any date range.
## Features

- **Dashboard** – latest value of each parameter with a status label
- **Charts** – interactive time-series charts with a custom date range
- **Tables** – sortable, paginated measurement history
- **Medical Places** – map for locating nearby medical facilities (Google Maps)
- **Hardware layer** – ESP32 + sensors sending measurements over Wi-Fi (HTTP/JSON)
- **Simulation mode** – Python scripts generating realistic data, so the app
  runs without any hardware

Monitored parameters: body temperature, heart rate, blood saturation (SpO2),
body weight, respiration rate, blood pressure.

## Architecture

```
ESP32 + sensors ──HTTP/JSON──▶ Express.js API ◀──▶ MongoDB Atlas
                                     ▲
                                     │ HTTP
                               Angular SPA
```

Simulated sensors (Python scripts) write directly to MongoDB Atlas,
bypassing the API.

| Layer    | Technologies                                             |
|----------|----------------------------------------------------------|
| Frontend | Angular, TypeScript, SCSS, Chart.js                      |
| Backend  | Node.js, Express.js, Mongoose                            |
| Database | MongoDB Atlas (one collection per parameter)             |
| Hardware | ESP32 WROOM DevKit, DS18B20, MAX30102, Arduino IDE (C++) |
| Tooling  | Git, VS Code, Python (data simulation)                   |

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB Atlas account (free tier is enough)
- Python 3 (for simulated data)
- Arduino IDE (only for the hardware part)

### 1. Backend
```bash
cd backend
npm install
```
Create a `.env` file:
```env
PORT=4001
USER_NAME=<atlas_user>
PASSWORD=<atlas_password>
CLUSTER_NAME=<cluster>
DATABASE_NAME=<database>
```
```bash
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Sample data (no hardware needed)
```bash
cd simulation
pip install pymongo
python generateAllData.py
```

### 4. Hardware (optional)
1. Wire the circuit as shown in [Hardware](#hardware).
2. Install libraries: `DallasTemperature`, `OneWire`, `DFRobot_BloodOxygen_S`.
3. Set Wi-Fi credentials and server address in the sketch and upload it.
4. Press the physical button for the chosen parameter to start a measurement.

## API

### Hardware endpoints (ESP32 to server)

`POST`, body. Sends JSON.

| Endpoint                  | Body                    | Description                    |
|---------------------------|-------------------------|--------------------------------|
| `/esp/temperature-sensor` | `{"temperature": 36.6}` | Saves body temperature (°C)    |
| `/esp/puls-sensor`        | `{"heartbeat": 72}`     | Saves heart rate (bpm)         |
| `/esp/saturation-sensor`  | `{"saturation": 98}`    | Saves blood saturation (%)     |


### Frontend endpoints (Angular to server)

`GET`, no body. Returns JSON.

| Parameter        | Latest measurement           | Full history                      |
|------------------|------------------------------|-----------------------------------|
| Body temperature | `/latest-body-temperature`   | `/all-data-body-temperature`      |
| Heart rate       | `/latest-hearth-rate`        | `/all-data-hearth-rate`           |
| Blood saturation | `/latest-blood-saturation`   | `/all-data-blood-saturation`      |
| Body weight      | `/latest-body-weight`        | `/all-data-body-weight`           |
| Respiration rate | `/latest-respiration-rate`   | `/all-data-respiration-rate`      |
| Blood pressure   | `/latest-blood-pressure`     | `/all-data-blood-pressure`        |

- `latest-*` returns the most recent document, e.g. `{ "latestBodyTemperature": { ... } }`
- `all-data-*` returns all stored measurements for the parameter

## Hardware

| Component         | Interface | Notes                              |
|-------------------|-----------|------------------------------------|
| ESP32 WROOM DevKit| –         | Wi-Fi client, HTTP POST to server  |
| DS18B20           | 1-Wire    | 4.7 kΩ pull-up between data and VCC|
| MAX30102          | I2C       | pull-ups on board, set switch to I2C|

![Electrical schema](https://github.com/mik00laj/HealthApp/assets/108618874/a40eb01b-67e5-41cd-b174-6a0b97da9f2c)


## Database

Each parameter has its own collection (`BodyTemperature`, `HearthRate`,
`BloodSaturation`, `BodyWeight`, `RespirationRate`, `BloodPressure`).

```json
{
  "sensorId": "DS18B20 Temperature Sensor",
  "value": 36.9,
  "fullDate": "2024-01-01 05:31",
  "date": "2024-01-01",
  "time": "05:31"
}
```
![image](https://github.com/mik00laj/HealthApp/assets/108618874/2560bb1f-6ddf-40a5-958c-b94ecacdf628)


## Screenshots

| Dashboard | Charts |
|-----------|--------|
| ![image](https://github.com/mik00laj/HealthApp/assets/108618874/17e539bb-c173-42eb-ae03-1083c547e94e) | ![image](https://github.com/mik00laj/HealthApp/assets/108618874/983c6960-0de0-4161-a8ac-d48670f7d169) |
| Tables | Medical Places|
| ![image](https://github.com/mik00laj/HealthApp/assets/108618874/3c7d476a-c8f0-4562-9d4e-3fe830e9c7a5) | ![image](https://github.com/mik00laj/HealthApp/assets/108618874/5e9303c9-125b-4d66-995c-b15dec774fca) |

## Current limitations

- Layout optimized for desktop screens only (not responsive yet)
- "Medical Places" opens Google Maps instead of searching in-app
- No user registration/login yet








