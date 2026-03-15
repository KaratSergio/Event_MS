import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../database/entities/event.entity';
import { User } from '../database/entities/user.entity';
import { Participant } from '../database/entities/participant.entity';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../database/entities/tag.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { ParticipantResponseDto } from './dto/participant-response.dto';
import { PaginatedResponse } from './dto/paginated-response.dto';
import {
  EventNotFoundException,
  UserNotFoundException,
  NotOrganizerException,
  PastDateException,
  InvalidCapacityException,
  CannotJoinOwnEventException,
  AlreadyJoinedException,
  EventFullException,
  NotParticipantException
} from '../common/exceptions/custom-exceptions';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    private tagsService: TagsService,
  ) { }

  // ========== EVENT CRUD ==========

  async create(dto: CreateEventDto, organizerId: string): Promise<EventResponseDto> {
    const organizer = await this.userRepository.findOne({ where: { id: organizerId } });
    if (!organizer) throw new UserNotFoundException();

    this._validateEventDate(dto.dateTime);
    this._validateCapacity(dto.capacity);

    let tags: Tag[] = [];
    if (dto.tags && dto.tags.length > 0) {
      tags = await this.tagsService.findOrCreate(dto.tags);
    }

    const event = this.eventRepository.create({
      ...dto,
      dateTime: new Date(dto.dateTime),
      organizerId,
      tags,
    });

    await this.eventRepository.save(event);
    this.logger.log(`Event created: ${event.id} by user ${organizerId}`);

    return this.findOne(event.id, organizerId);
  }

  async findAllPublic(
    userId?: string,
    page = 1,
    limit = 10,
    tagIds?: string[],
    sortBy: 'date' | 'title' | 'participants' = 'date',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<PaginatedResponse<EventResponseDto>> {

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoinAndSelect('event.tags', 'tags')
      .where('event.visibility = :visibility', { visibility: 'public' })
      .loadRelationCountAndMap('event.participantsCount', 'event.participants');

    if (tagIds?.length) {
      queryBuilder
        .innerJoin('event.tags', 'filteredTags')
        .andWhere('filteredTags.id IN (:...tagIds)', { tagIds })
        .groupBy('event.id')
        .addGroupBy('organizer.id')
        .addGroupBy('participants.id')
        .addGroupBy('participantUser.id')
        .addGroupBy('tags.id')
        .having('COUNT(DISTINCT filteredTags.id) = :tagCount', { tagCount: tagIds.length });
    }

    switch (sortBy) {
      case 'title':
        queryBuilder.orderBy('event.title', sortOrder);
        break;
      case 'participants':
        queryBuilder.orderBy('participantsCount', sortOrder);
        break;
      case 'date':
      default:
        queryBuilder.orderBy('event.dateTime', sortOrder);
    }

    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(100, Math.max(1, limit));

    queryBuilder
      .skip((validatedPage - 1) * validatedLimit)
      .take(validatedLimit);

    const [events, total] = await queryBuilder.getManyAndCount();

    return {
      data: events.map(event => this._toResponseDto(event, userId)),
      total,
      page: validatedPage,
      limit: validatedLimit,
      totalPages: Math.ceil(total / validatedLimit)
    };
  }

  async findOne(id: string, userId?: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants', 'participants.user', 'tags'],
    });

    if (!event) throw new EventNotFoundException();
    return this._toResponseDto(event, userId);
  }

  async update(id: string, dto: UpdateEventDto, userId: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['tags']
    });
    if (!event) throw new EventNotFoundException();
    if (event.organizerId !== userId) throw new NotOrganizerException();

    if (dto.dateTime) {
      this._validateEventDate(dto.dateTime);
      event.dateTime = new Date(dto.dateTime);
    }

    if (dto.capacity !== undefined) {
      this._validateCapacity(dto.capacity);
      event.capacity = dto.capacity;
    }

    if (dto.tags !== undefined) {
      if (dto.tags.length > 0) event.tags = await this.tagsService.findOrCreate(dto.tags);
      else event.tags = [];
    }

    Object.assign(event, dto);
    await this.eventRepository.save(event);
    this.logger.log(`Event updated: ${id}`);

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new EventNotFoundException();
    if (event.organizerId !== userId) throw new NotOrganizerException();

    await this.eventRepository.remove(event);
    this.logger.log(`Event deleted: ${id}`);
  }

  // ========== PARTICIPANTS LOGIC ==========

  async getParticipants(eventId: string): Promise<ParticipantResponseDto[]> {
    const participants = await this.participantRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'user')
      .select(['p.id', 'p.userId', 'p.eventId', 'p.joinedAt', 'user.id', 'user.email'])
      .where('p.eventId = :eventId', { eventId })
      .orderBy('p.joinedAt', 'ASC')
      .getMany();

    return participants.map(p => ({
      id: p.id,
      userId: p.userId,
      eventId: p.eventId,
      joinedAt: p.joinedAt,
      user: { id: p.user.id, email: p.user.email },
    }));
  }

  async join(eventId: string, userId: string): Promise<void> {
    await this.eventRepository.manager.transaction(async (manager) => {
      const event = await manager.findOne(Event, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!event) throw new EventNotFoundException();
      if (event.organizerId === userId) throw new CannotJoinOwnEventException();

      const existing = await manager.findOne(Participant, { where: { eventId, userId } });
      if (existing) throw new AlreadyJoinedException();

      const count = await manager.count(Participant, { where: { eventId } });
      if (event.capacity && count >= event.capacity) throw new EventFullException();

      await manager.save(Participant, { eventId, userId });
      this.logger.log(`User ${userId} joined event ${eventId}`);
    });
  }

  async leave(eventId: string, userId: string): Promise<void> {
    const participant = await this.participantRepository.findOne({ where: { eventId, userId } });
    if (!participant) throw new NotParticipantException();

    await this.participantRepository.remove(participant);
    this.logger.log(`User ${userId} left event ${eventId}`);
  }

  async isParticipant(eventId: string, userId: string): Promise<boolean> {
    const count = await this.participantRepository.count({ where: { eventId, userId } });
    return count > 0;
  }

  async getParticipantsCount(eventId: string): Promise<number> {
    return this.participantRepository.count({ where: { eventId } });
  }

  // ========== USER EVENTS ==========

  async getUserEvents(userId: string): Promise<EventResponseDto[]> {
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoinAndSelect('event.tags', 'tags')
      .where('event.organizerId = :userId', { userId })
      .orWhere('participants.userId = :userId', { userId })
      .orderBy('event.dateTime', 'ASC')
      .getMany();

    return events.map(event => this._toResponseDto(event, userId));
  }

  async getUserParticipations(userId: string): Promise<EventResponseDto[]> {
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participantUser')
      .leftJoinAndSelect('event.tags', 'tags')
      .where('participants.userId = :userId', { userId })
      .orderBy('event.dateTime', 'ASC')
      .getMany();

    return events.map(event => this._toResponseDto(event, userId));
  }

  // ========== PRIVATE HELPERS ==========

  private _validateEventDate(dateTime: string): void {
    const eventDate = new Date(dateTime);
    if (eventDate < new Date()) {
      throw new PastDateException();
    }
  }

  private _validateCapacity(capacity?: number): void {
    if (capacity !== undefined && capacity !== null && capacity < 1) {
      throw new InvalidCapacityException();
    }
  }

  private _toResponseDto(event: Event, userId?: string): EventResponseDto {
    const participantsCount = event.participants?.length || 0;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      dateTime: event.dateTime,
      location: event.location,
      capacity: event.capacity,
      visibility: event.visibility,
      organizerId: event.organizerId,
      organizer: {
        id: event.organizer.id,
        email: event.organizer.email,
      },
      participants: event.participants?.map(p => ({
        userId: p.userId,
        joinedAt: p.joinedAt,
        userEmail: p.user?.email,
      })) || [],
      participantsCount,
      isFull: event.capacity ? participantsCount >= event.capacity : false,
      userJoined: userId ? event.participants?.some(p => p.userId === userId) : false,
      canEdit: userId ? event.organizerId === userId : false,
      createdAt: event.createdAt,
      tags: event.tags?.map(tag => ({
        id: tag.id,
        name: tag.name,
      })) || [],
    };
  }
}