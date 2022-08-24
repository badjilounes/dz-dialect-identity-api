import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UpdateProfilePictureDto } from './dto/update-profile-picture-dto';
import { UserResponseDto } from './dto/user-response-dto';
import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UserId } from 'src/core/user-id/user-id.decorator';
import { MediaResponseDto } from 'src/media/dto/media-response-dto';
import { MediaUploadDto } from 'src/media/dto/media-upload-dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ operationId: 'username-exists', summary: 'Check wether a user exists with this username' })
  @Get('username/:username/exists')
  @ApiOkResponse({ type: Boolean })
  async usernameExists(@Param('username') username: string): Promise<boolean> {
    return this.usersService.usernameExists(username);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'get-connected-user', summary: 'Get connected user' })
  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  getConnectedUser(@UserId() userId: string): Promise<UserResponseDto> {
    return this.usersService.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create-profile-picture')
  @ApiOperation({
    summary: 'Create a profile picture media for a user',
    operationId: 'createProfilePictureMedia',
  })
  @ApiBody({ description: 'Media to upload', type: MediaUploadDto })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ status: 200, description: 'Media response', type: MediaResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  createProfilePictureMedia(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: string,
  ): Promise<MediaResponseDto> {
    const { buffer, mimetype, originalname } = file;
    return this.usersService.createProfilePictureMedia(userId, buffer, mimetype, originalname);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('picture')
  @ApiOperation({
    summary: 'Update user profile picture',
    operationId: 'updateProfilePicture',
  })
  @ApiOkResponse({ status: 200, description: 'User profile picture updated' })
  updateProfilePicture(@UserId() userId: string, @Body() body: UpdateProfilePictureDto): Promise<void> {
    return this.usersService.updateProfilePicture(userId, body.url);
  }
}
