import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
