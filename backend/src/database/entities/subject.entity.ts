import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { University } from './university.entity';
import { StudyGroup } from './study-group.entity';

@Entity('subjects')
@Index(['university_id', 'code'], { unique: true })
export class Subject {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 30 }) code: string;
  @Column({ length: 200 }) name: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'jsonb', nullable: true }) schedule: Record<string, any>;
  @Column({ length: 80, nullable: true }) professor: string;
  @Column({ type: 'int', default: 0 }) credits: number;

  @ManyToOne(() => University, (u) => u.subjects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_id' }) university: University;
  @Column() university_id: string;

  @OneToMany(() => StudyGroup, (g) => g.subject) groups: StudyGroup[];
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
