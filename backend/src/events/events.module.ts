import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from '../database/entities/event.entity';

import { User } from '../database/entities/user.entity';

import { Participant } from '../database/entities/participant.entity';

import { AuthMiddleware } from '../common/middleware/auth.middleware';

import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User, Participant]),
    TagsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],

  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('events');
  }
}