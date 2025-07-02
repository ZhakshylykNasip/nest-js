import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'todo_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // [Todo]
      synchronize: true,
      autoLoadEntities: true,
    }),
    TodoModule,
    DatabaseModule,
  ],
})
export class AppModule {}
