import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Event } from '../entities/event.entity';
import { Participant } from '../entities/participant.entity';
import { Tag } from '../entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Participant, Tag])],
  providers: [SeedService],
})
export class SeedModule { }
