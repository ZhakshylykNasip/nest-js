import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, SignInDto } from '../todo/dto/register-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { ICurrentUser } from './interfaces/current-user';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);

    this.logger.debug(user);

    return { ok: true };
  }

  @Public()
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(@CurrentUser() user: ICurrentUser) {
    return this.authService.refreshTokens(user.user, user.jwtToken);
  }
}
