import axios from 'axios';

export default async function handler(req, res) {
  const query = req.query.query;
  const apiKey = import.meta.env.VITE_SUPERHERO_API_KEY;

  try {
    const response = await axios.get(
      `https://superheroapi.com/api/${apiKey}/search/${query}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch heroes');
  }
}
