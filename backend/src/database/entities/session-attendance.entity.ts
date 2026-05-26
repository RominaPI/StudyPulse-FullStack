import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { StudySession } from './study-session.entity';
import { User } from './user.entity';

@Entity('session_attendances')
@Unique(['session_id', 'user_id'])
export class SessionAttendance {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => StudySession, (s) => s.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' }) session: StudySession;
  @Column() session_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User;
  @Column() user_id: string;

  @Column({ default: 'registered' }) status: string;
  @Column({ type: 'int', default: 0 }) focus_minutes: number;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
