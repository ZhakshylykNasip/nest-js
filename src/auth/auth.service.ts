import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../todo/entities/user.entity';
import { RegisterUserDto } from '../todo/dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(data: RegisterUserDto): Promise<{
    access_token: string;
    user: Pick<User, 'id' | 'name' | 'email'>;
  }> {
    const exist = await this.userRepository.findOneBy({ email: data.email });
    if (exist) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);

    const payload = { sub: savedUser.id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
