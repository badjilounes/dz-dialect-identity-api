import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserResponseDto } from './dto/user-response-dto';

import { AdminGuard } from 'src/core/admin/admin.guard';
import { UserId } from 'src/core/user-id/user-id.decorator';
import { GetAllUsersDto } from 'src/users/dto/get-all-users-dto';
import { PaginatedUserResponseDto } from 'src/users/dto/paginated-user-response-dto';
import { UpdateAdminDto } from 'src/users/dto/update-admin-dto';
import { UsersAdminService } from 'src/users/users-admin.service';

@ApiTags('users')
@Controller('users/admin')
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'get-connected-admin-user', summary: 'Get connected user' })
  @Get('me')
  @ApiOkResponse({ type: UserResponseDto })
  getConnectedUser(@UserId() userId: string): Promise<UserResponseDto> {
    return this.usersAdminService.me(userId);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'get-all', summary: 'Get all users' })
  @Get()
  @ApiOkResponse({ type: PaginatedUserResponseDto })
  getAll(@Query() payload: GetAllUsersDto): Promise<PaginatedUserResponseDto> {
    return this.usersAdminService.getAll(+payload.pageIndex, +payload.pageSize, payload.query);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post('is-admin')
  @ApiOperation({
    summary: 'Update if user is admin',
    operationId: 'updateAdmin',
  })
  @ApiOkResponse({ status: 200, description: 'User if user is admin' })
  updateadmin(@Body() body: UpdateAdminDto): Promise<void> {
    return this.usersAdminService.updateAdmin(body.userId, body.isAdmin);
  }
}
