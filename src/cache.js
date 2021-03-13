/* eslint-disable consistent-return */
// TODO útfæra redis cache
import redis from 'redis';
import util from 'util';
import dotenv from 'dotenv';

dotenv.config();

const {
  REDIS_URL: url,
} = process.env;

const redisOptions = {
  url,
};

const client = redis.createClient(redisOptions);

const asyncGet = util.promisify(client.get).bind(client);
const asyncSet = util.promisify(client.set).bind(client);

export async function getFromCache(type, period) {
  const key = `type:${type}-period:${period}`;
  const cached = await asyncGet(key);
  if (cached) {
    return cached;
  }
}

export async function addToCache(type, period, data) {
  const key = `type:${type}-period:${period}`;
  await asyncSet(key, JSON.stringify(data));
}
