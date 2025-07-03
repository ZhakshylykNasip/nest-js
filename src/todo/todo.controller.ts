import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFiltersDto } from './dto/todo-filters.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface AuthRequest extends ExpressRequest {
  user: {
    id: string;
    email: string;
    password: string;
    name: string;
  };
}

@ApiTags('todo')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(@Request() req: AuthRequest, @Query() filters: TodoFiltersDto) {
    return this.todoService.findAllByUser(req.user.id, filters);
  }

  @Post()
  async create(
    @Request() req: AuthRequest,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todoService.create(req.user.id, createTodoDto);
  }

  @Get(':id')
  async findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.todoService.findByIdForUser(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateForUser(id, req.user.id, updateTodoDto);
  }

  @Delete(':id')
  async remove(@Request() req: AuthRequest, @Param('id') id: string) {
    await this.todoService.deleteForUser(id, req.user.id);
    return { message: 'Успешно удален' };
  }
}
