import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { User } from './user.entity';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 200 }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'timestamptz', nullable: true }) due_date: Date;
  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' }) priority: TaskPriority;
  @Column({ type: 'enum', enum: ['todo', 'in_progress', 'review', 'done'], default: 'todo' }) status: TaskStatus;
  @Column({ type: 'int', default: 0 }) progress: number;

  @ManyToOne(() => StudyGroup, (g) => g.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' }) group: StudyGroup;
  @Column() group_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assignee_id' }) assignee: User;
  @Column({ nullable: true }) assignee_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' }) creator: User;
  @Column() created_by: string;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
