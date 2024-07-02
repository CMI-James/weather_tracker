const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const weatherApiKey = process.env.WEATHERAPI_KEY;
  try {
    const ipInfoResponse = await axios.get(
      `https://ipinfo.io/${clientIp}/json`
    );
    const location = ipInfoResponse.data.city || "Unknown location";
    const weatherData = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}`
    );
    const temperature = weatherData.data.current.temp_c;
    const greeting = visitorName
      ? `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
      : `Hello! The temperature is ${temperature} degrees Celsius in ${location}`;
    res.json({
      client_ip: clientIp,
      location: location,
      greeting: greeting,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Information could not be retrieved" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
