import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ operationId: 'username-exists', summary: 'Check wether a user exists with this username' })
  @Get('username/:username/exists')
  @ApiOkResponse({ type: Boolean })
  async usernameExists(@Param('username') username: string): Promise<boolean> {
    return this.usersService.usernameExists(username);
  }
}
