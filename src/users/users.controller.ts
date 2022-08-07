import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserResponseDto } from './dto/user-response-dto';
import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UserId } from 'src/core/user-id/user-id.decorator';

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
  @ApiOperation({ operationId: 'get-connected-user', summary: 'Get connected user' })
  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  getConnectedUser(@UserId() userId: string): Promise<UserResponseDto> {
    return this.usersService.findUserById(userId);
  }
}
