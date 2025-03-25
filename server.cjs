const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Add this line
require("dotenv").config();

const app = express();
const port = 3001;

// Enable CORS for requests from http://localhost:5173
app.use(cors({
  origin: "http://localhost:5173"
}));

const API_KEY = process.env.SUPERHERO_API_KEY;
console.log("API_KEY loaded from .env:", API_KEY);

app.get("/search/:query", async (req, res) => {
  const query = req.params.query;
  try {
    const response = await axios.get(
      `https://superheroapi.com/api/${API_KEY}/search/${query}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Superhero API" });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});