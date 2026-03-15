import {
  Controller, Get, Post, Body,
  Param, Delete, UseGuards, HttpStatus
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth,
  ApiOperation, ApiResponse
} from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { TagResponseDto } from './dto/tag.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: HttpStatus.OK, type: [TagResponseDto] })
  async findAll(): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.findAll();
    return tags.map(tag => new TagResponseDto(tag));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by id' })
  @ApiResponse({ status: HttpStatus.OK, type: TagResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  async findOne(@Param('id') id: string): Promise<TagResponseDto> {
    const tag = await this.tagsService.findOne(id);
    return new TagResponseDto(tag);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TagResponseDto })
  async create(@Body('name') name: string): Promise<TagResponseDto> {
    const tag = await this.tagsService.create(name);
    return new TagResponseDto(tag);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tag deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  async delete(@Param('id') id: string) {
    await this.tagsService.delete(id);
    return { message: 'Tag deleted successfully' };
  }
}