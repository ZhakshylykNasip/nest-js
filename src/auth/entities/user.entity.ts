import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'hashed_password' })
  hashedPassword!: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];

  async setPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 12);
    this.hashedPassword = hashedPassword;
  }

  async comparePassword(password: string) {
    const isPasswordMatching = await bcrypt.compare(
      password,
      this.hashedPassword,
    );

    return isPasswordMatching;
  }
}
