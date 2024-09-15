# Weather Station Project

## Overview

This project demonstrates a microservices-driven, full-stack implementation of a weather station using Raspberry Pi, React, Express, Flask, Docker, and Google Cloud Platform (GCP). It captures real-time environmental data, processes it securely, and visualizes it through a cloud-hosted dashboard. The architecture integrates hardware and cloud services, utilizing a scalable and secure microservices-based approach for real-time data analysis and visualization.

### Technologies Used:

- **Frontend**: React, Material UI (Hosted on Google Cloud Run)
- **Backend**: Express.js (Node.js) hosted on Google Cloud Run, Flask (Python) running on Raspberry Pi
- **Database**: Google Cloud SQL (secured via Cloud SQL Proxy)
- **Hardware**: Raspberry Pi with Sense HAT for data collection
- **Cloud**: Google Cloud Platform (GCP), Cloud SQL, Cloud Functions, Cloud Run, Artifact Registry, Cloud Scheduler
- **Other Tools**: Docker for containerization, Ngrok for secure Flask exposure

## Key Features

- **Microservices Architecture**: The system is designed as a microservices architecture, integrating a React frontend, an Express.js backend, and a Flask service for real-time environmental data collection, processing, and visualization.
- **Dockerized Services**: All services (Flask, React, and Express) are containerized using Docker for easy deployment and scaling. Flask runs on the Raspberry Pi, while React and Express are deployed on Google Cloud Run.
- **Ngrok for Secure Tunneling**: Ngrok is used to securely expose the Flask service running on the private Raspberry Pi network, allowing it to interact with cloud services.
- **Secure Database Connection**: The connection between Flask and Google Cloud SQL is secured via the Cloud SQL Proxy, ensuring safe data handling and transfer.
- **Automated Backups**: The Express.js backend uses Google Cloud Scheduler to automate periodic backups, archiving sensor data to Google Cloud Storage.
- **Continuous Deployment**: The entire deployment and service hosting is managed using Google Cloud Run and Artifact Registry for seamless operations and scalability.

---

## Project Structure

This repository contains the necessary files and scripts for the Weather Station project. Below is an overview of the current structure and contents:

### `backend/`

The backend contains the Express.js server responsible for handling API requests, managing data storage, and interacting with Google Cloud services.

### `frontend/`

The frontend contains the React.js code for the weather dashboard's user interface, allowing users to view real-time weather data.

### `PiScripts/`

This directory contains the scripts that run on the Raspberry Pi to gather weather data and securely send it to the cloud.

- **db.py**: Handles database interactions and schema setup for storing weather data.
- **gatherData.py**: Gathers data from the Sense HAT and writes it to the Cloud SQL database.
- **server.py**: Runs the Flask server that processes requests and exposes the weather data through a secure Ngrok tunnel.

---

## Architecture Diagram

This diagram illustrates the overall architecture, including the interaction between the Raspberry Pi, Flask, Google Cloud services, and the frontend/backend applications running on Google Cloud Run.

![Architecture](https://github.com/user-attachments/assets/a8b598ba-5ea8-4046-a9a5-32a8f02cd04b)


---
