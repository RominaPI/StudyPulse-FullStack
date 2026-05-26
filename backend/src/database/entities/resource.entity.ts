import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { User } from './user.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 200 }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column() url: string;
  @Column({ default: 'link' }) type: string;

  @ManyToOne(() => StudyGroup, (g) => g.resources, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' }) group: StudyGroup;
  @Column() group_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by' }) uploader: User;
  @Column() uploaded_by: string;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
