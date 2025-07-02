import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createTodoSchema = z.object({
  title: z.string().min(3).optional(),
  isCompleted: z.boolean().default(false),
});

export class CreateTodoDto extends createZodDto(createTodoSchema) {
  static schema = createTodoSchema;

  @ApiProperty({ example: 'string', description: 'Заголовок задачи' })
  title: string;
  @ApiPropertyOptional()
  isCompleted: boolean;
}
