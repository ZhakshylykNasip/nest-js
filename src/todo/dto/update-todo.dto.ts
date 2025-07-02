import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CreateTodoDto } from './create-todo.dto';

const updateTodoSchema = CreateTodoDto.schema.partial();

export class UpdateTodoDto extends createZodDto(updateTodoSchema) {
  @ApiPropertyOptional({ description: 'Заголовок задачи', required: false })
  title?: string;

  @ApiPropertyOptional({
    description: 'Статус выполнения задачи',
    required: false,
    default: false,
  })
  isCompleted?: boolean;
}
