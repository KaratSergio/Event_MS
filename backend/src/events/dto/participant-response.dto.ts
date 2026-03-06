import { ApiProperty } from '@nestjs/swagger';

class ParticipantUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

export class ParticipantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty({ type: ParticipantUserDto })
  user: ParticipantUserDto;
}

export class ParticipantsCountDto {
  @ApiProperty()
  count: number;
}

export class ParticipationStatusDto {
  @ApiProperty()
  isParticipant: boolean;
}