require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3001;

const BACKUP_DIR = path.join(__dirname, "backups");

// Check if backup directory exists, if not, create it
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

app.use(cors()); // Use CORS middleware to handle cross-origin requests

// Endpoint to fetch data from Flask and convert CSV to JSON
app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.FLASK_API_URL}/data`, {
      responseType: "stream",
    });

    let results = [];
    response.data
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        res.json(results);
      });
  } catch (error) {
    console.error("Error fetching data from Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to fetch alerts from Flask
app.get("/api/alert", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.FLASK_API_URL}/alert`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching alert from Flask API:", error);
    res.status(500).send("Internal Server Error");
  }
});

//Backup script
app.get("/api/backup", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.FLASK_API_URL}/data`, {
      responseType: "stream",
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/[:\-T]/g, "")
      .split(".")[0];
    const backupFileName = `weather_data_backup_${timestamp}.csv.gz`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);

    const writeStream = fs.createWriteStream(backupPath);
    response.data.pipe(writeStream);

    writeStream.on("close", () => {
      exec(`gzip ${backupPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Backup failed: ${error}`);
          return res.status(500).send("Failed to create backup");
        }
        console.log(`Data backed up successfully to ${backupFileName}`);
        res.send(`Data backed up successfully to ${backupFileName}`);
      });
    });
  } catch (error) {
    console.error("Error fetching data from Flask API for backup:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
