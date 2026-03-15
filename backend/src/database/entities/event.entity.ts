import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, JoinColumn, ManyToMany, JoinTable
} from 'typeorm';
import { User } from './user.entity';
import { Participant } from './participant.entity';
import { Tag } from './tag.entity';

@Entity('events')
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

  @Column({ nullable: true })
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

  @ManyToMany(() => Tag, (tag) => tag.events, {
    cascade: true,
  })
  @JoinTable({
    name: 'event_tags',
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}