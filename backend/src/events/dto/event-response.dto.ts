import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from '../../tags/dto/tag.dto';

class OrganizerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

class ParticipantDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty({ required: false })
  userEmail?: string;
}

export class EventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  dateTime: Date;

  @ApiProperty()
  location: string;

  @ApiProperty({ required: false })
  capacity?: number;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  organizerId: string;

  @ApiProperty()
  organizer: OrganizerDto;

  @ApiProperty()
  participants: ParticipantDto[];

  @ApiProperty()
  participantsCount: number;

  @ApiProperty()
  isFull: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  userJoined?: boolean;

  @ApiProperty({ required: false })
  canEdit?: boolean;

  @ApiProperty({ type: [TagDto], required: false })
  tags?: TagDto[];
}