import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    let target;
    try {
      target = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Allowlist of domains we proxy
    const allowedHosts = new Set(['www.superherodb.com', 'superherodb.com']);
    if (!allowedHosts.has(target.hostname)) {
      return res.status(400).json({ error: 'Host not allowed' });
    }

    // Prime cookies
    let cookieHeader = '';
    try {
      const priming = await axios.get('https://www.superherodb.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 10000
      });
      const setCookie = priming.headers['set-cookie'];
      if (Array.isArray(setCookie)) {
        cookieHeader = setCookie.map(c => c.split(';')[0]).join('; ');
      }
    } catch (_) {}

    const response = await axios.get(target.toString(), {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        Referer: 'https://www.superherodb.com/',
        Origin: 'https://www.superherodb.com',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        Cookie: cookieHeader
      },
      timeout: 15000,
      validateStatus: (s) => s >= 200 && s < 500
    });

    if (response.status >= 400) {
      console.error('Image proxy upstream error:', response.status, target.toString());
      return res.status(response.status).json({ error: `Upstream ${response.status}` });
    }

    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return res.status(200).send(Buffer.from(response.data));
  } catch (err) {
    console.error('Image proxy error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch image' });
  }
}
