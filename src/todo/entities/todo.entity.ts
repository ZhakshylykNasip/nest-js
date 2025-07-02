import { Entity, Column, PrimaryColumn } from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

const todoEntityPropsSchema = z.object({
  id: z.string().default(() => createId()),
  title: z.string().min(3),
  isCompleted: z.boolean().default(false),
});

const updateTodoEntityPropsSchema = todoEntityPropsSchema
  .omit({ id: true })
  .partial();

@Entity()
export class Todo {
  @PrimaryColumn()
  readonly id: string;
  @Column()
  title: string;
  @Column({ default: false })
  isCompleted: boolean;

  constructor(props?: z.input<typeof todoEntityPropsSchema>) {
    if (props) {
      const validated = todoEntityPropsSchema.parse(props);
      this.id = validated.id;
      this.title = validated.title;
      this.isCompleted = validated.isCompleted;
    }
  }

  update(data: z.input<typeof updateTodoEntityPropsSchema>) {
    const validated = updateTodoEntityPropsSchema.parse(data);

    this.title = validated.title ?? this.title;
    this.isCompleted = validated.isCompleted ?? this.isCompleted;
  }
}
