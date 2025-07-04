export interface IJwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessLifetime: string;
  refreshLifetime: string;
}
