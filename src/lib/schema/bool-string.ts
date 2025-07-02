import { z } from 'zod';

export const boolString = z
  .enum(['true', 'false'])
  .transform((val) => val === 'true')
  .pipe(z.boolean());
