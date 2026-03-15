import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TagDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class TagResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(tag: TagDto) {
    this.id = tag.id;
    this.name = tag.name;
  }
}