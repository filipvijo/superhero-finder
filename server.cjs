const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Add this line
require("dotenv").config();

const app = express();
const port = 3001;

// Enable CORS for local dev (Vite runs on 3000 by default)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}));

const API_KEY = process.env.SUPERHERO_API_KEY || process.env.VITE_SUPERHERO_API_KEY;
console.log("SUPERHERO_API_KEY loaded:", API_KEY ? "[set]" : "[missing]");

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

// Image proxy to bypass hotlink protection in dev
app.get("/image-proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });

    let target;
    try {
      target = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const allowedHosts = new Set(["www.superherodb.com", "superherodb.com"]);
    if (!allowedHosts.has(target.hostname)) {
      return res.status(400).json({ error: "Host not allowed" });
    }

    // Prime cookies from homepage to satisfy possible checks
    let cookieHeader = '';
    try {
      const priming = await axios.get('https://www.superherodb.com/', {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 10000,
      });
      const setCookie = priming.headers['set-cookie'];
      if (Array.isArray(setCookie)) {
        cookieHeader = setCookie.map(c => c.split(';')[0]).join('; ');
      }
    } catch (e) {
      // continue without cookie
    }

    const response = await axios.get(target.toString(), {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        Referer: "https://www.superherodb.com/",
        Origin: "https://www.superherodb.com",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Cookie: cookieHeader,
      },
      timeout: 15000,
      validateStatus: (status) => status >= 200 && status < 500, // forward 4xx instead of throwing
    });

    if (response.status >= 400) {
      console.error("Image proxy upstream error:", response.status, target.toString());
      return res.status(response.status).json({ error: `Upstream ${response.status}` });
    }

    const contentType = response.headers["content-type"] || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    return res.status(200).send(Buffer.from(response.data));
  } catch (err) {
    console.error("Image proxy error:", err.message);
    return res.status(500).json({ error: "Failed to fetch image" });
  }
});

// Root diagnostic
app.get('/', (_req, res) => {
  res.status(200).send('Superhero Finder proxy running. Endpoints: /search/:query, /image-proxy?url=...');
});
