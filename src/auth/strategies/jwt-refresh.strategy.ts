import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { jwtConfig } from 'src/config/jwt.config';
import { IJwtConfig } from 'src/config/interfaces/jwt-config.interface';
import { JwtPayload } from '../interfaces/jwt-payload';
import { JWT_REFRESH_STRATEGY } from '../auth.constants';
import { ICurrentUser } from '../interfaces/current-user';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY,
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    jwtConfig: IJwtConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<ICurrentUser> {
    const jwtToken = req.headers.authorization?.split(' ')[1];
    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user || !jwtToken) {
      throw new UnauthorizedException();
    }

    return {
      userId: user.id,
      jwtPayload: payload,
      user,
      jwtToken: jwtToken,
    };
  }
}
