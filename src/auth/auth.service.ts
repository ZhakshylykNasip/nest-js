import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterUserDto } from '../todo/dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { jwtConfig } from 'src/config/jwt.config';
import { IJwtConfig } from 'src/config/interfaces/jwt-config.interface';
import { Tokens } from './value-objects/tokens.vo';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfig: IJwtConfig,
  ) {}

  async register(data: RegisterUserDto): Promise<User> {
    const exist = await this.userRepository.findOneBy({ email: data.email });
    if (exist) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = this.userRepository.create(data);

    await user.setPassword(data.password);

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  async signIn(email: string, password: string): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Неверный пароль или email');
    }
    const isPasswordMatching = await user.comparePassword(password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Неверный пароль или email');
    }

    const tokens = await this.createTokens(user);
    return tokens;
  }

  async refreshTokens(user: User, refreshToken: string) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessLifetime,
    });

    return new Tokens({ accessToken, refreshToken });
  }

  async createTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessLifetime,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshLifetime,
    });

    return new Tokens({ accessToken, refreshToken });
  }
}
