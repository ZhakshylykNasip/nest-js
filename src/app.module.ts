import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { User } from './todo/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'todo_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}', User], // [Todo]
      synchronize: true,
      autoLoadEntities: true,
    }),
    TodoModule,
    AuthModule,
  ],
})
export class AppModule {}
