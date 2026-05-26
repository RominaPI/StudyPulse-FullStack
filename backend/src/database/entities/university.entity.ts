import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Subject } from './subject.entity';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 200 }) name: string;
  @Column({ length: 10 }) country_code: string;
  @Column({ nullable: true }) website: string;
  @Column({ nullable: true }) logo_url: string;
  @OneToMany(() => User, (u) => u.university) users: User[];
  @OneToMany(() => Subject, (s) => s.university) subjects: Subject[];
  @CreateDateColumn({ type: 'timestamptz' }) created_at: Date;
}
