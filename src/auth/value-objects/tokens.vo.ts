import { z } from 'zod';

export const tokensPropsSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export class Tokens {
  readonly accessToken: string;
  readonly refreshToken: string;

  constructor(props: z.input<typeof tokensPropsSchema>) {
    const validated = tokensPropsSchema.parse(props);
    this.accessToken = validated.accessToken;
    this.refreshToken = validated.refreshToken;
  }
}
