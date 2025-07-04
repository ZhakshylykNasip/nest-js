import { z } from 'zod';
import { registerAs } from '@nestjs/config';
import { IJwtConfig } from './interfaces/jwt-config.interface';

const EnvSchema = z.object({
  ACCESS_SECRET: z.string().nonempty(),
  REFRESH_SECRET: z.string().nonempty(),
  ACCESS_LIFETIME: z.string().nonempty().default('5m'),
  REFRESH_LIFETIME: z.string().nonempty().default('7d'),
});

const LoadConfig = EnvSchema.transform((env) => {
  return {
    accessSecret: env.ACCESS_SECRET,
    refreshSecret: env.REFRESH_SECRET,
    accessLifetime: env.ACCESS_LIFETIME,
    refreshLifetime: env.REFRESH_LIFETIME,
  } satisfies IJwtConfig;
});

export const jwtConfig = registerAs('jwt-config', () => {
  return LoadConfig.parse(process.env);
});
