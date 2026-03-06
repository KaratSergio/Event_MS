import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [UsersController],
})
export class UsersModule { }