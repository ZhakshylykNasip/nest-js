import { z } from 'zod';
import { registerAs } from '@nestjs/config';
import { IDatabaseConfig } from './interfaces/db-config.interface';

const EnvSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
});

const LoadConfig = EnvSchema.transform((env) => {
  return {
    databaseUrl: env.DATABASE_URL,
  } satisfies IDatabaseConfig;
});

export const dbConfig = registerAs('db-config', () => {
  return LoadConfig.parse(process.env);
});
