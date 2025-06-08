import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import "dotenv/config.js";

/**
 * Upstash rate limiter instance.
 */
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s")
});

export default ratelimit;