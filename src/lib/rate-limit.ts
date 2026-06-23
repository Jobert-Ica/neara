type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

const store: RateLimitStore = {};

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function rateLimit(ip: string, action: string, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${ip}:${action}`;

  const record = store[key];

  if (!record) {
    store[key] = {
      count: 1,
      resetTime: now + options.windowMs,
    };
    return { success: true, limit: options.limit, remaining: options.limit - 1, reset: store[key].resetTime };
  }

  // If window has passed, reset
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + options.windowMs;
    return { success: true, limit: options.limit, remaining: options.limit - 1, reset: record.resetTime };
  }

  // Increment count
  record.count += 1;
  const remaining = Math.max(0, options.limit - record.count);

  if (record.count > options.limit) {
    return { success: false, limit: options.limit, remaining: 0, reset: record.resetTime };
  }

  return { success: true, limit: options.limit, remaining, reset: record.resetTime };
}
