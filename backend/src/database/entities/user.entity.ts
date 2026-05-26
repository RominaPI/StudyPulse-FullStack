import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { University } from './university.entity';
import { GroupMember } from './group-member.entity';
import { Task } from './task.entity';
import { Friendship } from './friendship.entity';

export type UserRole = 'student' | 'moderator' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index({ unique: true }) @Column({ length: 120 }) email: string;
  @Column({ length: 60 }) full_name: string;
  @Index({ unique: true }) @Column({ length: 40 }) username: string;
  @Column({ select: false }) password_hash: string;
  @Column({ nullable: true }) avatar_url: string;
  @Column({ type: 'enum', enum: ['student', 'moderator', 'admin'], default: 'student' }) role: UserRole;
  @Column({ default: true }) is_active: boolean;
  @Column({ nullable: true }) reset_token: string;
  @Column({ type: 'timestamptz', nullable: true }) reset_token_expires_at: Date;

  @ManyToOne(() => University, (u) => u.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'university_id' }) university: University;
  @Column({ nullable: true }) university_id: string;

  @OneToMany(() => GroupMember, (gm) => gm.user) memberships: GroupMember[];
  @OneToMany(() => Task, (t) => t.assignee) assigned_tasks: Task[];
  @OneToMany(() => Friendship, (f) => f.requester) friendships: Friendship[];

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updated_at: Date;
}
