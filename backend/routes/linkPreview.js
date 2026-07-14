// GET /api/link-preview?url=https://example.com
// Proxies Open Graph metadata fetching server-side to avoid CORS issues

import express from 'express';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio'; // or use 'open-graph-scraper' if already installed

const router = express.Router();

router.get('/link-preview', async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  // Basic validation — must be a real HTTP URL
  try { new URL(url); } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Security: reject internal/private IP ranges
  const parsed = new URL(url);
  const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
  if (blocked.includes(parsed.hostname)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Meetifyy Link Preview Bot/1.0' },
      timeout: 5000,
      size: 500000 // max 500KB response
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const og = (prop) =>
      $(`meta[property="og:${prop}"]`).attr('content') ||
      $(`meta[name="og:${prop}"]`).attr('content') || null;

    const twitter = (prop) =>
      $(`meta[name="twitter:${prop}"]`).attr('content') || null;

    return res.json({
      title:       og('title')       || twitter('title')       || $('title').text() || null,
      description: og('description') || twitter('description') || $('meta[name="description"]').attr('content') || null,
      image:       og('image')       || twitter('image')       || null,
      siteName:    og('site_name')   || parsed.hostname,
      url:         og('url')         || url,
      favicon:     `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`
    });

  } catch (err) {
    return res.status(422).json({ error: 'Could not fetch preview', detail: err.message });
  }
});

export default router;
