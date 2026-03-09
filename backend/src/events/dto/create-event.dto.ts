import {
  IsString, IsNotEmpty, IsDateString,
  IsNumber, Min, IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2024' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Annual technology conference with industry experts' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  dateTime: string;

  @ApiProperty({ example: 'Convention Center, New York' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 100, required: true })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ enum: EventVisibility, example: EventVisibility.PUBLIC })
  @IsEnum(EventVisibility)
  visibility: EventVisibility;
}