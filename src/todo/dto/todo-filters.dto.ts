import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { boolString } from 'src/lib/schema/bool-string';
import { z } from 'zod';

const todoFiltersSchema = z.object({
  search: z.string().optional(),
  completed: boolString.optional(),
});

export class TodoFiltersDto extends createZodDto(todoFiltersSchema) {
  @ApiPropertyOptional({ example: 'string', description: 'Search' })
  search?: string;
  @ApiPropertyOptional({ example: false, description: 'Is Completed filter' })
  completed?: boolean;
}
