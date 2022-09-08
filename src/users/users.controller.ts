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

import { UpdateEmailDto } from './dto/update-email-dto ';
import { UpdateNameDto } from './dto/update-name-dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture-dto';
import { UpdateUsernameDto } from './dto/update-username-dto';
import { UserResponseDto } from './dto/user-response-dto';
import { UsersService } from './users.service';

import { JwtAuthPassThroughGuard } from 'src/auth/jwt/jwt-auth-pass-through.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UserId } from 'src/core/user-id/user-id.decorator';
import { MediaResponseDto } from 'src/media/dto/media-response-dto';
import { MediaUploadDto } from 'src/media/dto/media-upload-dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthPassThroughGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'usernameExists', summary: 'Check wether a user exists with this username' })
  @Get('username/:username/exists')
  @ApiOkResponse({ type: Boolean })
  async usernameExists(@Param('username') username: string, @UserId() userId: string): Promise<boolean> {
    return this.usersService.usernameExists(username, userId);
  }

  @UseGuards(JwtAuthPassThroughGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'emailExists', summary: 'Check wether a user exists with this email' })
  @Get('email/:email/exists')
  @ApiOkResponse({ type: Boolean })
  async emailExists(@Param('email') email: string, @UserId() userId: string): Promise<boolean> {
    return this.usersService.emailExists(email, userId);
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
    return this.usersService.createUserImage(userId, buffer, mimetype, originalname);
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
    return this.usersService.updateImageUrl(userId, body.url);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('username')
  @ApiOperation({
    summary: 'Update user username',
    operationId: 'updateUsername',
  })
  @ApiOkResponse({ status: 200, description: 'User username updated', type: UserResponseDto })
  updateUsername(@UserId() userId: string, @Body() body: UpdateUsernameDto): Promise<UserResponseDto> {
    return this.usersService.updateUsername(userId, body.username);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('name')
  @ApiOperation({
    summary: 'Update user name',
    operationId: 'updateName',
  })
  @ApiOkResponse({ status: 200, description: 'User name updated', type: UserResponseDto })
  updateName(@UserId() userId: string, @Body() body: UpdateNameDto): Promise<UserResponseDto> {
    return this.usersService.updateName(userId, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('email')
  @ApiOperation({
    summary: 'Update user email',
    operationId: 'updateEmail',
  })
  @ApiOkResponse({ status: 200, description: 'User email updated', type: UserResponseDto })
  updateEmail(@UserId() userId: string, @Body() body: UpdateEmailDto): Promise<UserResponseDto> {
    return this.usersService.updateEmail(userId, body.email);
  }
}
