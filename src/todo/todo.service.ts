import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoFiltersDto } from './dto/todo-filters.dto';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  // Получить все тудушки пользователя с фильтрами
  async findAllByUser(filters: TodoFiltersDto, userId?: string) {
    return this.todoRepository.find({
      where: {
        userId,
        title: filters.search ? ILike(`%${filters.search}%`) : undefined,
        isCompleted: filters.completed,
      },
    });
  }

  // Создать тудушку, привязанную к пользователю
  async create(userId: string, createTodoDto: CreateTodoDto) {
    const todo = new Todo({ ...createTodoDto, userId });
    return this.todoRepository.save(todo);
  }

  // Найти тудушку по id и userId (чтобы не получить чужую)
  async findByIdForUser(id: string, userId: string) {
    const todo = await this.todoRepository.findOneBy({ id, userId });
    if (!todo) {
      throw new NotFoundException(`Todo с id=${id} не найден`);
    }
    return todo;
  }

  // Обновить тудушку только если она принадлежит пользователю
  async updateForUser(
    id: string,
    userId: string,
    updateTodoDto: UpdateTodoDto,
  ) {
    const todo = await this.findByIdForUser(id, userId);
    todo.update(updateTodoDto);
    return this.todoRepository.save(todo);
  }

  // Удалить тудушку только если она принадлежит пользователю
  async deleteForUser(id: string, userId: string) {
    const todo = await this.findByIdForUser(id, userId);
    await this.todoRepository.delete(todo.id);
  }
}
