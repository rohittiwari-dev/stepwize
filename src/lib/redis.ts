import 'server-only';

import { Redis } from '@upstash/redis';

/**
 * Upstash Redis client (HTTP/REST — serverless-friendly, no persistent socket).
 *
 * Reads `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the env.
 * Shared by the realtime publisher and the rate limiters so there's a single
 * connection config to manage.
 */
export const redis = Redis.fromEnv();
