import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../entities/user.entity';
import { Event } from '../entities/event.entity';
import { Participant } from '../entities/participant.entity';
import { Tag } from '../entities/tag.entity';

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
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
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

      // 2. TAGS
      const tagNames = [
        'tech', 'music', 'art', 'business',
        'sports', 'food', 'workshop',
        'conference', 'networking'
      ];

      const tags: Tag[] = [];
      for (const name of tagNames) {
        const tag = this.tagRepository.create({ name });
        tags.push(tag);
      }

      await this.tagRepository.save(tags);
      this.logger.log(`✓ ${tags.length} tags created`);

      // 3. EVENTS
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

      // Event 4: this weekend
      const thisWeekend = new Date(now);
      const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
      const daysUntilSaturday = dayOfWeek === 6 ? 0 : 6 - dayOfWeek;
      thisWeekend.setDate(now.getDate() + daysUntilSaturday);

      const event1 = this.eventRepository.create({
        title: 'Tech Conference 2024',
        description: 'Annual technology conference with industry experts',
        dateTime: tomorrow,
        location: 'Convention Center, New York',
        capacity: 100,
        visibility: 'public',
        organizerId: user1.id,
        tags: tags.filter(t => ['tech', 'conference'].includes(t.name))
      });

      const event2 = this.eventRepository.create({
        title: 'Web Development Workshop',
        description: 'Hands-on workshop on modern web development',
        dateTime: nextWeek,
        location: 'Online (Zoom)',
        capacity: 50,
        visibility: 'public',
        organizerId: user1.id,
        tags: tags.filter(t => ['tech', 'workshop'].includes(t.name))
      });

      const event3 = this.eventRepository.create({
        title: 'Networking Meetup',
        description: 'Casual networking event for tech professionals',
        dateTime: nextWeek,
        location: 'Downtown Cafe',
        visibility: 'public',
        organizerId: user2.id,
        tags: tags.filter(t => ['business', 'networking'].includes(t.name))
      });

      const event4 = this.eventRepository.create({
        title: 'Jazz Night',
        description: 'Evening of live jazz music',
        dateTime: thisWeekend,
        location: 'Blue Note Jazz Club',
        capacity: 80,
        visibility: 'public',
        organizerId: user2.id,
        tags: tags.filter(t => ['music', 'art'].includes(t.name))
      });

      const event5 = this.eventRepository.create({
        title: 'Food Festival',
        description: 'Taste cuisines from around the world',
        dateTime: nextMonth,
        location: 'City Park',
        capacity: 200,
        visibility: 'public',
        organizerId: user1.id,
        tags: tags.filter(t => ['food', 'art'].includes(t.name))
      });

      await this.eventRepository.save([event1, event2, event3, event4, event5]);
      this.logger.log('✓ 5 events created with tags');

      // 4. PARTICIPANTS
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

      const participant4 = this.participantRepository.create({
        userId: user1.id,
        eventId: event4.id,
      });

      await this.participantRepository.save([participant1, participant2, participant3, participant4]);
      this.logger.log('✓ Participants added');

      // 5. RESULT, statistic
      this.logger.log('✓ Seeding completed!');
      this.logger.log('\n=== TEST DATA SUMMARY ===');
      this.logger.log(`Users: 2 (bob@g.com, jane@g.com)`);
      this.logger.log(`Tags: ${tags.length} created`);
      this.logger.log(`Events: 5 created with tags:`);
      this.logger.log(`  - Tech Conference: tech, conference`);
      this.logger.log(`  - Web Dev Workshop: tech, workshop`);
      this.logger.log(`  - Networking Meetup: business, networking`);
      this.logger.log(`  - Jazz Night: music, art`);
      this.logger.log(`  - Food Festival: food, art`);
      this.logger.log(`Participants: 4 participations`);
      this.logger.log('\nTest credentials:');
      this.logger.log('bob@g.com / 123456');
      this.logger.log('jane@g.com / 123456');

    } catch (error) {
      this.logger.error('Seeding failed', error.stack);
    }
  }
}