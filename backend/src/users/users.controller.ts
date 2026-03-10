import { Controller, Get, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: HttpStatus.OK, description: 'User profile' })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'List of user events' })
  async getMyEvents(@Request() req) {
    return this.eventsService.getUserEvents(req.user.id);
  }

  @Get('me/participations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get events where user is participant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of participations' })
  async getMyParticipations(@Request() req) {
    return this.eventsService.getUserParticipations(req.user.id);
  }
}