import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../database/entities/user.entity';
import { Event } from '../database/entities/event.entity';
import { Participant } from '../database/entities/participant.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) { }

  async onModuleInit() {
    setTimeout(() => {
      this.seed().catch(err => {
        this.logger.error('Seeding failed:', err);
      });
    }, 5000);
  }

  async seed() {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      this.logger.log('Database already seeded');
      return;
    }

    this.logger.log('Starting seeding...');

    try {
      // 1. USERS
      const hashedPassword = await argon2.hash('123456');

      const user1 = this.userRepository.create({
        email: 'bob@g.com',
        passwordHash: hashedPassword
      });

      const user2 = this.userRepository.create({
        email: 'jane@g.com',
        passwordHash: hashedPassword
      });

      await this.userRepository.save([user1, user2]);
      this.logger.log('✓ 2 users created');

      // 2. EVENTS
      const now = new Date();

      // Event 1: tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Event 2: next week
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);

      // Event 3: next month
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const event1 = this.eventRepository.create({
        title: 'Tech Conference 2024',
        description: 'Annual technology conference with industry experts',
        dateTime: tomorrow,
        location: 'Convention Center, New York',
        capacity: 100,
        visibility: 'public',
        organizerId: user1.id,
      });

      const event2 = this.eventRepository.create({
        title: 'Web Development Workshop',
        description: 'Hands-on workshop on modern web development',
        dateTime: nextWeek,
        location: 'Online (Zoom)',
        capacity: 50,
        visibility: 'public',
        organizerId: user1.id,
      });

      const event3 = this.eventRepository.create({
        title: 'Networking Meetup',
        description: 'Casual networking event for tech professionals',
        dateTime: nextWeek,
        location: 'Downtown Cafe',
        // capacity: undefined , // unlimited
        visibility: 'public',
        organizerId: user2.id,
      });

      await this.eventRepository.save([event1, event2, event3]);
      this.logger.log('✓ 3 events created');

      // 3. PARTICIPANTS
      const participant1 = this.participantRepository.create({
        userId: user2.id,
        eventId: event1.id,
      });

      const participant2 = this.participantRepository.create({
        userId: user1.id,
        eventId: event3.id,
      });

      const participant3 = this.participantRepository.create({
        userId: user2.id,
        eventId: event2.id,
      });

      await this.participantRepository.save([participant1, participant2, participant3]);
      this.logger.log('✓ Participants added');

      this.logger.log('✓ Seeding completed!');
      this.logger.log('\nTest credentials:');
      this.logger.log('Bob Dylan: bob@g.com / 123456');
      this.logger.log('Jane Smith: jane@g.com / 123456');

    } catch (error) {
      this.logger.error('Seeding failed', error.stack);
    }
  }
}