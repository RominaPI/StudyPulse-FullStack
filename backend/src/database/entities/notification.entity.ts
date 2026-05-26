import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index() @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User;
  @Column() user_id: string;

  @Column({ length: 60 }) type: string;
  @Column({ length: 200 }) title: string;
  @Column({ type: 'text' }) body: string;
  @Column({ type: 'jsonb', nullable: true }) data: Record<string, any>;
  @Column({ default: false }) read: boolean;
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
