import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { User } from './user.entity';
import { SessionAttendance } from './session-attendance.entity';

@Entity('study_sessions')
export class StudySession {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 200 }) title: string;
  @Column({ type: 'text', nullable: true }) goal: string;
  @Column({ type: 'timestamptz' }) starts_at: Date;
  @Column({ type: 'int', default: 25 }) duration_minutes: number;
  @Column({ default: 'pomodoro' }) timer_mode: string;
  @Column({ default: 'scheduled' }) status: string;

  @ManyToOne(() => StudyGroup, (g) => g.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' }) group: StudyGroup;
  @Column() group_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'host_id' }) host: User;
  @Column() host_id: string;

  @OneToMany(() => SessionAttendance, (a) => a.session, { cascade: true })
  attendances: SessionAttendance[];

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
