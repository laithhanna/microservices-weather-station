import os
import csv
import random
import time
from datetime import datetime
from sense_hat import SenseHat

from db import write_weather_data

# Constants and global variables
sense = SenseHat()
DEMO_MODE = True
CSV_FILE = 'weather_data.csv'
latest_temperature = None  # Global variable to hold the latest recorded temperature

# Initialize CSV with headers if doesn't exist
if not os.path.isfile(CSV_FILE):
    with open(CSV_FILE, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Time", "Temperature", "Humidity", "Pressure", "State"])

def gather_data():
    global latest_temperature

    base_temperature = 29.5
    base_humidity = 55
    base_pressure = 1000
    previous_temperature = 0  # Initialized to 0

    while True:
        if DEMO_MODE:
            # Simulated data
            temperature = round(base_temperature + random.uniform(-1, 1),2)
            #temperature = -1 #For testing alerts
            humidity = round(base_humidity + random.uniform(-3, 3),2)
            pressure = round(base_pressure + random.uniform(-2, 2),2)
            base_temperature = temperature
            base_humidity = humidity
            base_pressure = pressure
        else:
            # Real data from Sense HAT
            temperature = round(sense.get_temperature(),2)
            humidity = round(sense.get_humidity(),2)
            pressure = round(sense.get_pressure(),2)

        # Determine temperature state
        if temperature > previous_temperature + 0.5:
            state = "rising"
        elif temperature < previous_temperature - 0.5:
            state = "falling"
        else:
            state = "stable"
        
        # Log data to database
        write_weather_data(
            Time=datetime.now(),
            Temperature=temperature,
            Humidity=humidity,
            Pressure=pressure,
            State=state
        )

        # Log data to CSV
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(CSV_FILE, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([current_time, temperature, humidity, pressure, state])

        # Update the latest_temperature for alert checking
        latest_temperature = temperature

        previous_temperature = temperature
        time.sleep(10)

if __name__ == "__main__":
    gather_data()
