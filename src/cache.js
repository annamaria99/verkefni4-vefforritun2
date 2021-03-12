// TODO útfæra redis cache
import redis from 'redis';
import util from 'util';

const redisOptions = {
  url: 'redis://127.0.0.1:6379/0',
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
