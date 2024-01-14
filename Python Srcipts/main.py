import json
from datetime import datetime, timedelta
import random
from pymongo import MongoClient
from bson import ObjectId

try:
    exec(open('generateBodyTemperatureData.py').read())
    print("Udało sie uruchomić generateBodyTemperatureData.py")
except Exception as error:
    print(f"Błąd podczas uruchamiania generateBodyTemperatureData.py: {error}")

try:
    exec(open('generateBloodSaturationData.py').read())
    print("Udało sie uruchomić generateBloodSaturationData.py")
except Exception as error:
    print(f"Błąd podczas uruchamiania generateBloodSaturationData.py: {error}")

try:
    exec(open('generateHearthRateData.py').read())
    print("Udało sie uruchomić generateHearthRateData.py")
except Exception as error:
    print(f"Błąd podczas uruchamiania generateHearthRateData.py: {error}")

try:
    exec(open('generateBodyWeightData.py').read())
    print("Udało sie uruchomić generateBodyWeightData.py")
except Exception as error:
    print(f"Błąd podczas uruchamiania generateBodyWeightData.py: {error}")

try:
    exec(open('generateRespirationRateData.py').read())
    print("Udało sie uruchomić ggenerateRespirationRateData.py")
except Exception as error:
    print(f"Błąd podczas uruchamiania gegenerateRespirationRateData.py: {error}")


try:
    exec(open('generateBloodPressureData.py').read())
    print("Udało sie uruchomić generateBloodPressureData.py")
except Exception as error:
    print(f"Błąd podczas uruchamiania generateBloodPressureData.py: {error}")
