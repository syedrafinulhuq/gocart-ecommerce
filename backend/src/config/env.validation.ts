import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string().optional(),

  CORS_ORIGIN: z.string().optional(),

  COOKIE_SECURE: z.string().optional(),
  COOKIE_DOMAIN: z.string().optional(),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  ACCESS_TOKEN_TTL: z.string().optional(),
  REFRESH_TOKEN_TTL_DAYS: z.string().optional(),
});

export function validateEnvOrThrow(env: NodeJS.ProcessEnv) {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
}
