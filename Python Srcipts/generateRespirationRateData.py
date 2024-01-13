import json
from datetime import datetime, timedelta
import random
from pymongo import MongoClient
from bson import ObjectId

# Konfiguracja połączenia z bazą danych MongoDB Atlas
username = 'HealthAppUser'
password = 'admin'
cluster_name = 'healthappdb'
database_name = 'User1'
collection_name = 'RespirationRate'
connection_string_mongodb = f"mongodb+srv://{username}:{password}@{cluster_name}.tir6wnc.mongodb.net/{database_name}?retryWrites=true&w=majority"

# Połączenie z MongoDB
client = MongoClient(connection_string_mongodb)
db = client[database_name]
collection = db[collection_name]

# Tworzenie danych dla każdego dnia miesiąca
start_date = datetime(2024, 1, 1)
end_date = datetime(2024, 12, 31)
current_date = start_date
sensor_id = "DS18B20 Temperature Sensor"
data_list = []


def generate_object_id():
    return str(ObjectId())


def generate_random_value(min_value, max_value):
    return round(random.uniform(min_value, max_value), 0)


# Funkcja do generowania losowego czasu w zakresie od 00:00 do 24:00
def generate_data_for_day(date_str, sensor_id):
    full_date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    data_list = []
    # Pierwszy pomiar od 5:00 do 8:00
    data_list.append(generate_measurement(full_date_obj, sensor_id, 5, 8))
    # Drugi pomiar od 10:00 do 13:00
    data_list.append(generate_measurement(full_date_obj, sensor_id, 10, 13))
    # Trzeci pomiar od 15:00 do 18:00
    data_list.append(generate_measurement(full_date_obj, sensor_id, 15, 18))
    # Ostatni pomiar od 20:00 do 23:59
    data_list.append(generate_measurement(full_date_obj, sensor_id, 20, 23, 59))

    return data_list


def generate_measurement(full_date_obj, sensor_id, start_hour, end_hour, end_minute=0):
    random_time = f"{random.randint(start_hour, end_hour):02d}:{random.randint(0, 59):02d}"
    full_date_str = f"{full_date_obj.strftime('%Y-%m-%d')} {random_time}"

    data = {
        "_id": generate_object_id(),
        "sensorId": sensor_id,
        "value": generate_random_value(10, 22),
        "fullDate": datetime.strptime(full_date_str, "%Y-%m-%d %H:%M").strftime("%Y-%m-%d %H:%M"),
        "date": full_date_obj.strftime("%Y-%m-%d"),
        "time": random_time,
        "__v": 0
    }

    return data


while current_date <= end_date:
    date_str = current_date.strftime("%Y-%m-%d")
    data = generate_data_for_day(date_str, sensor_id)
    data_list.extend(data)  # Use extend to add elements from the generated list
    current_date += timedelta(days=1)

# Wstawienie danych do bazy danych
collection.insert_many(data_list)
# Zamknięcie połączenia z bazą danych
client.close()
