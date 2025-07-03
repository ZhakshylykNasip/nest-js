import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1).describe('Имя пользователя'),
  email: z.string().email().describe('Email'),
  password: z.string().min(4).describe('Пароль (мин. 4 символа)'),
});

export class RegisterUserDto extends createZodDto(registerSchema) {
  static schema = registerSchema;

  @ApiProperty({ example: 'Жакшылык' })
  name: string;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: 'qwerty123' })
  password: string;
}

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export class SignInDto extends createZodDto(signInSchema) {
  static schema = signInSchema;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'qwerty123' })
  password: string;
}
