import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../database/entities/tag.entity';
import {
  TagNotFoundException,
  TagAlreadyExistsException,
  TagNameRequiredException
} from '../common/exceptions/custom-exceptions';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) { }

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) throw new TagNotFoundException(id);
    return tag;
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.tagsRepository
      .createQueryBuilder('tag')
      .where('LOWER(tag.name) = LOWER(:name)', { name })
      .getOne();
  }

  async create(name: string): Promise<Tag> {
    if (!name || !name.trim()) throw new TagNameRequiredException();

    const existingTag = await this.findByName(name);
    if (existingTag) throw new TagAlreadyExistsException(name);

    const tag = this.tagsRepository.create({
      name: name.toLowerCase().trim()
    });

    const savedTag = await this.tagsRepository.save(tag);
    this.logger.log(`Tag created: ${savedTag.id} - ${savedTag.name}`);

    return savedTag;
  }

  async findOrCreate(names: string[]): Promise<Tag[]> {
    if (!names || names.length === 0) return [];

    const uniqueNames = [...new Set(names.map(n => n.toLowerCase().trim()).filter(Boolean))];

    const tags: Tag[] = [];

    for (const name of uniqueNames) {
      let tag = await this.findByName(name);
      if (!tag) tag = await this.create(name);
      tags.push(tag);
    }

    return tags;
  }

  async delete(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagsRepository.remove(tag);
    this.logger.log(`Tag deleted: ${id}`);
  }
}