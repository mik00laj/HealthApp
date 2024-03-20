import json
from datetime import datetime, timedelta
import random
from pymongo import MongoClient
from bson import ObjectId
try:
    exec(open('generateBodyTemperatureData.py').read())
    print("Succeeded generateBodyTemperatureData.py")
except Exception as error:
    print(f"Failed generateBodyTemperatureData.py: {error}")
try:
    exec(open('generateBloodSaturationData.py').read())
    print("Succeeded generateBloodSaturationData.py")
except Exception as error:
    print(f"Failed generateBloodSaturationData.py: {error}")
try:
    exec(open('generateHearthRateData.py').read())
    print("Succeeded generateHearthRateData.py")
except Exception as error:
    print(f"Failed generateHearthRateData.py: {error}")
try:
    exec(open('generateBodyWeightData.py').read())
    print("Succeeded generateBodyWeightData.py")
except Exception as error:
    print(f"Failed generateBodyWeightData.py: {error}")
try:
    exec(open('generateRespirationRateData.py').read())
    print("Succeeded generateRespirationRateData.py")
except Exception as error:
    print(f"Failed generateRespirationRateData.py: {error}")
try:
    exec(open('generateBloodPressureData.py').read())
    print("Succeeded generateBloodPressureData.py")
except Exception as error:
    print(f"Failed generateBloodPressureData.py: {error}")

