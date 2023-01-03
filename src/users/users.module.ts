import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserExternalEntity } from './entities/user-external.entity';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

import { MediaModule } from 'src/media/media.module';
import { UsersAdminController } from 'src/users/users-admin.controller';
import { UsersAdminService } from 'src/users/users-admin.service';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserExternalEntity]), MediaModule],
  providers: [UsersService, UsersRepository, UsersAdminService],
  controllers: [UsersController, UsersAdminController],
  exports: [UsersService],
})
export class UsersModule {}
