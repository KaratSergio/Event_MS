import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, JoinColumn, Check
} from 'typeorm';
import { User } from './user.entity';
import { Participant } from './participant.entity';

@Entity('events')
@Check(`"capacity" >= 1`)
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ name: 'date_time', type: 'timestamp' })
  dateTime: Date;

  @Column()
  location: string;

  @Column({
    nullable: false,
    default: 1
  })
  capacity: number;

  @Column({ default: 'public' })
  visibility: 'public' | 'private';

  @Column({ name: 'organizer_id' })
  organizerId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.organizedEvents)
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @OneToMany(() => Participant, participant => participant.event, { cascade: true })
  participants: Participant[];
}