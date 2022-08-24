/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiDefaultResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { MediaService } from './media.service';

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Get(':id/file')
  @ApiOperation({
    summary: 'Retrieve one Media file',
    operationId: 'getMediaFile',
  })
  @ApiDefaultResponse({ content: { 'application/octet-stream': {} } })
  async getFile(@Param('id') id: string, @Res() response: Response) {
    const file = await this.service.getFileById(id);
    response.set('Content-Type', file?.mimeType);
    response.set('Content-Disposition', `attachment; filename="${encodeURI(file?.name)}"`);
    response.end(file?.data);
  }
}
