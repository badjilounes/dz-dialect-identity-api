import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { Repository } from 'typeorm';

import { UserExternalEntity } from './entities/user-external.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  checkPassword(user: UserEntity, password: string): boolean {
    return compareSync(password, user.password);
  }

  createFromBasicProvider(username: string, password: string): Promise<UserEntity> {
    return this.userRepository.save({
      username,
      password: hashSync(password, +this.configService.get('BCRYPT_SALT_ROUNDS')),
    });
  }

  createFromExternalProvider(username: string, externalUser: UserExternalEntity): Promise<UserEntity> {
    return this.userRepository.save({ username, externalUser });
  }

  findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findOneById(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  findOneByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  updateImageUrl(userId: string, imageUrl: string): Promise<UserEntity> {
    return this.userRepository.save({ id: userId, imageUrl });
  }

  findOneByUserExternalId(userExternalId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        userExternal: { id: userExternalId },
      },
    });
  }
}
