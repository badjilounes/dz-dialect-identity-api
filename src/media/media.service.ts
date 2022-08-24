/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MediaResponseDto } from './dto/media-response-dto';
import { MediaEntity } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, buffer: Buffer, mimeType: string, originalName: string): Promise<MediaResponseDto> {
    const mediaToSave = this.mediaRepository.create({
      data: buffer,
      mimeType,
      name: originalName,
      user: { id: userId },
    });

    const media = await this.mediaRepository.save(mediaToSave);

    return {
      id: media.id,
      url: this.buildMediaUrlFromId(media.id),
    };
  }

  async getFileById(id: string): Promise<MediaEntity> {
    const media = await this.mediaRepository.findOne({ where: { id } });

    if (!media) {
      throw new NotFoundException(`L'image avec l'id ${id} n'existe pas`);
    }

    return media;
  }

  private buildMediaUrlFromId(id: string): string {
    return `${this.configService.get('SERVER_DOMAIN')}/media/${id}/file`;
  }
}
