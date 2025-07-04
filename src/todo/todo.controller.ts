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
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFiltersDto } from './dto/todo-filters.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';

@ApiTags('todo')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(
    @CurrentUser('userId') userId: string,
    @Query() filters: TodoFiltersDto,
  ) {
    return this.todoService.findAllByUser(filters, userId);
  }

  @Post()
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todoService.create(userId, createTodoDto);
  }

  @Get(':id')
  async findOne(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.todoService.findByIdForUser(id, userId);
  }

  @Patch(':id')
  async update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateForUser(id, userId, updateTodoDto);
  }

  @Delete(':id')
  async remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    await this.todoService.deleteForUser(id, userId);
    return { message: 'Успешно удален' };
  }
}
