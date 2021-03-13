/* eslint-disable no-console */
// TODO útfæra proxy virkni
import fetch from 'node-fetch';
import express from 'express';
import dotenv from 'dotenv';
import { timerStart, timerEnd } from './time.js';
import { getFromCache, addToCache } from './cache.js';

dotenv.config();

export const router = express.Router();

const {
  API_URL: apiUrl,
} = process.env;

async function getEarthquakes(req, res) {
  const startTime = timerStart();
  const { type, period } = req.query;
  let data;
  try {
    data = await getFromCache(type, period);
  } catch (err) {
    console.error(err);
  }
  let cached = true;
  if (!data) {
    cached = false;
    const url = new URL(`${type}_${period}.geojson`, apiUrl).href;
    console.log(url);
    const response = await fetch(url);
    data = await response.json();
    try {
      await addToCache(type, period, data);
    } catch (err) {
      console.error(err);
    }
  } else {
    data = JSON.parse(data);
  }
  const elapsed = timerEnd(startTime);
  res.json({ data, info: { cached, elapsed } });
}

router.get('/', getEarthquakes);
