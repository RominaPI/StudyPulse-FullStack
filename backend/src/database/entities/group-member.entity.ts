import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { User } from './user.entity';

export type GroupRole = 'owner' | 'admin' | 'member';

@Entity('group_members')
@Unique(['group_id', 'user_id'])
export class GroupMember {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => StudyGroup, (g) => g.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' }) group: StudyGroup;
  @Column() group_id: string;

  @ManyToOne(() => User, (u) => u.memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) user: User;
  @Column() user_id: string;

  @Column({ type: 'enum', enum: ['owner', 'admin', 'member'], default: 'member' })
  role: GroupRole;

  @CreateDateColumn({ type: 'timestamptz' }) joined_at: Date;
}
