import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { User } from './user.entity';
import { GroupMember } from './group-member.entity';
import { Task } from './task.entity';
import { StudySession } from './study-session.entity';
import { Resource } from './resource.entity';

@Entity('study_groups')
export class StudyGroup {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 120 }) name: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ default: false }) is_private: boolean;
  @Column({ type: 'int', default: 25 }) max_members: number;
  @Column({ nullable: true }) avatar_url: string;

  @ManyToOne(() => Subject, (s) => s.groups, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'subject_id' }) subject: Subject;
  @Column({ nullable: true }) subject_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' }) owner: User;
  @Column() owner_id: string;

  @OneToMany(() => GroupMember, (gm) => gm.group, { cascade: true }) members: GroupMember[];
  @OneToMany(() => Task, (t) => t.group) tasks: Task[];
  @OneToMany(() => StudySession, (s) => s.group) sessions: StudySession[];
  @OneToMany(() => Resource, (r) => r.group) resources: Resource[];

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
