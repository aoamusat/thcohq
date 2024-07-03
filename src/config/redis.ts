import { createClient } from "redis";

const RedisCache = createClient();

RedisCache.on("error", (err) => {
   console.error("Redis error:", err);
});

RedisCache.connect();

export { RedisCache };
