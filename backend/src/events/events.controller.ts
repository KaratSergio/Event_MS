import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Request, HttpCode, HttpStatus
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth,
  ApiOperation, ApiResponse
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import {
  ParticipantResponseDto,
  ParticipantsCountDto,
  ParticipationStatusDto
} from './dto/participant-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  // ========== BASIC CRUD ==========

  @Get()
  @ApiOperation({ summary: 'Get all public events' })
  @ApiResponse({ status: 200, type: [EventResponseDto] })
  async findAll(@Request() req) {
    const userId = req.user?.id;
    return this.eventsService.findAllPublic(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.eventsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, type: EventResponseDto })
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, type: EventResponseDto })
  @ApiResponse({ status: 403, description: 'Only organizer can edit' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event deleted' })
  @ApiResponse({ status: 403, description: 'Only organizer can delete' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id);
  }

  // ========== PARTICIPANTS NESTED ROUTES ==========

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get all event participants' })
  @ApiResponse({ status: 200, type: [ParticipantResponseDto] })
  async getParticipants(@Param('id') id: string) {
    return this.eventsService.getParticipants(id);
  }

  @Post(':id/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join event' })
  @ApiResponse({ status: 201, description: 'Joined successfully' })
  @ApiResponse({ status: 400, description: 'Cannot join' })
  async join(@Param('id') id: string, @Request() req) {
    return this.eventsService.join(id, req.user.id);
  }

  @Delete(':id/participants/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave event' })
  @ApiResponse({ status: 200, description: 'Left successfully' })
  @ApiResponse({ status: 400, description: 'Cannot leave' })
  @HttpCode(HttpStatus.OK)
  async leave(@Param('id') id: string, @Request() req) {
    return this.eventsService.leave(id, req.user.id);
  }

  @Get(':id/participants/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if current user is participant' })
  @ApiResponse({ status: 200, type: ParticipationStatusDto })
  async checkParticipation(@Param('id') id: string, @Request() req) {
    const isParticipant = await this.eventsService.isParticipant(id, req.user.id);
    return { isParticipant };
  }

  @Get(':id/participants/count')
  @ApiOperation({ summary: 'Get participants count' })
  @ApiResponse({ status: 200, type: ParticipantsCountDto })
  async getParticipantsCount(@Param('id') id: string) {
    const count = await this.eventsService.getParticipantsCount(id);
    return { count };
  }
}