import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Event } from './event.entity';
import { Participant } from './participant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Event, event => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => Participant, participant => participant.user)
  participation: Participant[];
}