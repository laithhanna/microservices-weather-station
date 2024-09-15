import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

function App() {
  const [data, setData] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const initiateBackup = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/backup`
      );
      console.log("Backup response:", response.data);
    } catch (error) {
      console.error("Error initiating backup:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/data`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const checkAlerts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/alert`
        );
        const temperature = response.data.temperature;
        const alertMessage = response.data.alert;

        if (alertMessage) {
          let severity = "info";

          if (temperature > 30) {
            severity = "error";
          } else if (temperature < 0) {
            severity = "info";
          }

          setAlertData({ open: true, severity, message: alertMessage });
        } else {
          setAlertData({ ...alertData, open: false });
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchData();
    checkAlerts();
    const dataInterval = setInterval(fetchData, 8000);
    const alertInterval = setInterval(checkAlerts, 8000); // Checking every 8 seconds
    const backupInterval = setInterval(initiateBackup, 20000); // Initiating backup every 20 seconds

    // Cleanup: Clear intervals to prevent memory leaks and unintended behaviors when component unmounts
    return () => {
      clearInterval(dataInterval);
      clearInterval(alertInterval);
      clearInterval(backupInterval);
    };
  }, []);

  const handleClose = () => {
    setAlertData({ ...alertData, open: false });
  };

  const getChartData = (field) => {
    return {
      labels: data.map((record) => record.Time),
      datasets: [
        {
          label: field,
          data: data.map((record) => record[field]),
          fill: false,
          borderColor:
            field === "Temperature"
              ? "red"
              : field === "Pressure"
              ? "blue"
              : "green",
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <Container>
      <h1>Sensor Data</h1>
      {/* Alert Notification */}
      {alertData.open && (
        <MuiAlert
          severity={alertData.severity}
          onClose={handleClose}
          variant="filled"
          elevation={6}
        >
          {alertData.message}
        </MuiAlert>
      )}
      {/* Graphs */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
        height="100vh" // Take up full viewport height
        mt={3}
        mb={3}
      >
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxWidth="33vw"
        >
          <Box width="100%" height="60vh">
            {" "}
            <Line
              data={getChartData("Pressure")}
              style={{ width: "500px", height: "450px" }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Box>

        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxWidth="33vw"
        >
          <Box width="100%" height="60vh">
            {" "}
            <Line
              data={getChartData("Temperature")}
              style={{ width: "500px", height: "450px" }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Box>

        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxWidth="33vw"
        >
          <Box width="100%" height="60vh">
            {" "}
            <Line
              data={getChartData("Humidity")}
              style={{ width: "500px", height: "450px" }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
