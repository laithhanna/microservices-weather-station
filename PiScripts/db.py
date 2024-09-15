# db.py
import os
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, Float, String, DateTime
from sqlalchemy.sql import text
from sqlalchemy.orm import sessionmaker
# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Retrieve environment variables
username = os.getenv('CLOUD_SQL_USERNAME')
password = os.getenv('CLOUD_SQL_PASSWORD')
database_name = os.getenv('CLOUD_SQL_DATABASE_NAME')
connection_name = os.getenv('CLOUD_SQL_CONNECTION_NAME')

# Define the database URI
db_uri = f'mysql+pymysql://{username}:{password}@127.0.0.1:3306/{database_name}'

# Create a database engine
engine = create_engine(db_uri, echo=True)

# Define metadata object
metadata = MetaData()

# Define table structure
weather_data_table = Table('sensor_data', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('Time', DateTime, nullable=False),
    Column('Temperature', Float, nullable=False),
    Column('Humidity', Float, nullable=False),
    Column('Pressure', Float, nullable=False),
    Column('State', String(255), nullable=False),
)

#metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

def write_weather_data(Time, Temperature, Humidity, Pressure, State):
    """Write a new record to the sensor_data table."""
    try:
        session.begin()

        new_record = weather_data_table.insert().values(
            Time=Time,
            Temperature=Temperature,
            Humidity=Humidity,
            Pressure=Pressure,
            State=State
        )

        session.execute(new_record)

        session.commit()
    except Exception as e:
        print(f"An error occurred: {e}")
        session.rollback()
    finally:
        session.close()
