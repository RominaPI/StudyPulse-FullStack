import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';

export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';

@Entity('friendships')
@Unique(['requester_id', 'addressee_id'])
export class Friendship {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => User, (u) => u.friendships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_id' }) requester: User;
  @Column() requester_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'addressee_id' }) addressee: User;
  @Column() addressee_id: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'blocked'], default: 'pending' })
  status: FriendshipStatus;

  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
