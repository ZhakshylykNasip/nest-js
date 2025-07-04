import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { User } from './auth/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { dbConfig } from './config/db.config';
import { ConfigModule } from '@nestjs/config';
import { IDatabaseConfig } from './config/interfaces/db-config.interface';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [jwtConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory(config: IDatabaseConfig) {
        return {
          type: 'postgres',
          url: config.databaseUrl,
          entities: [__dirname + '/**/*.entity{.ts,.js}', User], // [Todo]
          synchronize: true,
          autoLoadEntities: true,
        };
      },
    }),
    TodoModule,
    AuthModule,
  ],
})
export class AppModule {}
