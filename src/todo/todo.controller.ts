import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFiltersDto } from './dto/todo-filters.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(
    @Query()
    filters: TodoFiltersDto,
  ) {
    return this.todoService.findAll(filters);
  }
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    const todo = await this.todoService.create(createTodoDto);
    return todo;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const todo = await this.todoService.findById(id);
    return todo;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoService.update(id, updateTodoDto);
    return todo;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todoService.delete(id);
    return { message: 'Успешно удален' };
  }
}
