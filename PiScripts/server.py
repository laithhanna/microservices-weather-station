import csv
from flask import Flask, send_file, jsonify


app = Flask(__name__)
# Constants
CSV_FILE = 'weather_data.csv'
latest_temperature = None  # Global variable to hold the latest recorded temperature

@app.route('/data', methods=['GET'])
def send_csv():
    response = send_file(CSV_FILE, mimetype='text/csv', attachment_filename='weather_data.csv', as_attachment=True)
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response
    
@app.route('/alert', methods=['GET'])
def check_alert():
    global latest_temperature
    
    # Update the latest temperature from the CSV
    with open(CSV_FILE, 'r') as file:
        rows = list(csv.reader(file))
        if len(rows) > 1:
            latest_temperature = float(rows[-1][1])

    if latest_temperature is None:
        return jsonify(alert=None, temperature=None)
    
    if latest_temperature > 30:
        return jsonify(alert="High Temperature Alert! Above 30°C", temperature=latest_temperature)
    elif latest_temperature < 0:
        return jsonify(alert="Low Temperature Alert! Below 0°C", temperature=latest_temperature)
    
    return jsonify(alert=None, temperature=latest_temperature)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
