import { createClient } from "redis";

const RedisCache = createClient({ url: process.env.REDIS_URL });

RedisCache.on("error", (err) => {
   console.error("Redis error:", err);
});

RedisCache.connect();

export { RedisCache };
