import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ZodValidationPipe());

  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setTitle('Todo app')
    .setDescription('The todo app API description')
    .setVersion('1.0')
    // Добавляем security-схему для Bearer token
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log(`Server started at http://localhost:${PORT}`);
  console.log(`Swagger available at http://localhost:${PORT}/api`);
}

void bootstrap();
