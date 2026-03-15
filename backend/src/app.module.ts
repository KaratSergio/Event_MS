import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './database/seed/seed.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    AuthModule,
    UsersModule,
    EventsModule,
    TagsModule,
    DatabaseModule,
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
