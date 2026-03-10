import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Request, HttpCode, HttpStatus, Query
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
  @ApiResponse({ status: HttpStatus.OK, type: [EventResponseDto] })
  async findAll(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user?.id;
    return this.eventsService.findAllPublic(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiResponse({ status: HttpStatus.OK, type: EventResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.eventsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: HttpStatus.CREATED, type: EventResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data or past date' })
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: HttpStatus.OK, type: EventResponseDto })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only organizer can edit' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event not found' })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Event deleted' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only organizer can delete' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Event not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id);
  }

  // ========== PARTICIPANTS NESTED ROUTES ==========

  @Get(':id/participants')
  @ApiOperation({ summary: 'Get all event participants' })
  @ApiResponse({ status: HttpStatus.OK, type: [ParticipantResponseDto] })
  async getParticipants(@Param('id') id: string) {
    return this.eventsService.getParticipants(id);
  }

  @Post(':id/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join event' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Joined successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Already joined or event full' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot join own event' })
  async join(@Param('id') id: string, @Request() req) {
    await this.eventsService.join(id, req.user.id);
    return { message: 'Successfully joined the event' };
  }

  @Delete(':id/participants/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave event' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Left successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Not a participant' })
  @HttpCode(HttpStatus.OK)
  async leave(@Param('id') id: string, @Request() req) {
    await this.eventsService.leave(id, req.user.id);
    return { message: 'Successfully left the event' };
  }

  @Get(':id/participants/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if current user is participant' })
  @ApiResponse({ status: HttpStatus.OK, type: ParticipationStatusDto })
  async checkParticipation(@Param('id') id: string, @Request() req) {
    const isParticipant = await this.eventsService.isParticipant(id, req.user.id);
    return { isParticipant };
  }

  @Get(':id/participants/count')
  @ApiOperation({ summary: 'Get participants count' })
  @ApiResponse({ status: HttpStatus.OK, type: ParticipantsCountDto })
  async getParticipantsCount(@Param('id') id: string) {
    const count = await this.eventsService.getParticipantsCount(id);
    return { count };
  }
}