import axios from 'axios';

export default async function handler(req, res) {
  const { query } = req.query;
  const apiKey = process.env.VITE_SUPERHERO_API_KEY;

  try {
    const response = await axios.get(
      `https://superheroapi.com/api/${apiKey}/search/${query}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch heroes' });
  }
}
