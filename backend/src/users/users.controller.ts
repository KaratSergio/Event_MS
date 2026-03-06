import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EventsService } from '../events/events.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly eventsService: EventsService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
    };
  }

  @Get('me/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user events (organizer + participant)' })
  async getMyEvents(@Request() req) {
    return this.eventsService.getUserEvents(req.user.id);
  }

  @Get('me/participations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get events where user is participant' })
  async getMyParticipations(@Request() req) {
    return this.eventsService.getUserParticipations(req.user.id);
  }

  @Get(':userId/events')
  @ApiOperation({ summary: 'Get user events by user id' })
  async getUserEvents(@Param('userId') userId: string) {
    return this.eventsService.getUserEvents(userId);
  }
}