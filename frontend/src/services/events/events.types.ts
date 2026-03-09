export interface EventOrganizer {
  id: string;
  email: string;
}

export interface EventParticipant {
  userId: string;
  eventId: string;
  joinedAt: string;
  userEmail: string;
}

export interface EventsApiResponse {
  data: Event[];
  total: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string; // ISO string
  location: string;
  capacity: number;
  visibility: 'public' | 'private';
  organizerId: string;
  organizer?: EventOrganizer;
  participants?: EventParticipant[];
  participantsCount: number;
  isFull: boolean;
  userJoined: boolean;
  canEdit: boolean;
  createdAt: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity: number;
  visibility: 'public' | 'private';
}

export interface UpdateEventDto extends Partial<CreateEventDto> { }

export interface EventFilters {
  visibility?: 'public' | 'private';
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// Participants
export interface ParticipantResponse {
  userId: string;
  eventId: string;
  joinedAt: string;
  user?: {
    email: string;
  };
}

export interface ParticipantsCount {
  count: number;
}

export interface ParticipationStatus {
  isParticipant: boolean;
}