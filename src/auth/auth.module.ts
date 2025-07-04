import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from 'src/auth/entities/user.entity';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { jwtConfig } from 'src/config/jwt.config';
import { IJwtConfig } from 'src/config/interfaces/jwt-config.interface';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      useFactory(config: IJwtConfig) {
        return {
          secret: config.accessSecret,
        };
      },
    }),
  ],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
