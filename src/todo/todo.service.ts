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
    private todoReposity: Repository<Todo>,
  ) {}

  async findAll(filters: TodoFiltersDto) {
    return this.todoReposity.find({
      where: {
        title: filters.search ? ILike(`%${filters.search}%`) : undefined,
        isCompleted: filters.completed,
      },
    });
  }

  async create(createTodoDto: CreateTodoDto) {
    const todo = new Todo(createTodoDto);

    return this.todoReposity.save(todo);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoReposity.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo с id=${id} не найден`);
    }
    todo.update(updateTodoDto);
    return this.todoReposity.save(todo);
  }

  async delete(id: string) {
    await this.todoReposity.delete(id);
  }

  async findById(id: string) {
    const todo = this.todoReposity.findOneBy({ id });
    return todo;
  }
}
