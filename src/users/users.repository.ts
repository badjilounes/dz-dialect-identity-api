import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { FindManyOptions, Not, Repository } from 'typeorm';

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

  createFromExternalProvider(username: string, userExternal: UserExternalEntity): Promise<UserEntity> {
    return this.userRepository.save({ username, userExternal });
  }

  paginate(options: FindManyOptions<UserEntity>): Promise<[UserEntity[], number]> {
    return this.userRepository.findAndCount(options);
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

  findOneByEmailExcept(email: string, userId?: string) {
    return userId ? this.userRepository.findOne({ where: { email, id: Not(userId) } }) : this.findOneByEmail(email);
  }

  findOneByUsernameExcept(username: string, userId?: string) {
    return userId
      ? this.userRepository.findOne({ where: { username, id: Not(userId) } })
      : this.findOneByUsername(username);
  }

  findOneByUserExternalId(userExternalId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        userExternal: { id: userExternalId },
      },
    });
  }

  updateEmail(userId: string, email: string): Promise<UserEntity> {
    return this.userRepository.save({ id: userId, email });
  }

  updateImageUrl(userId: string, imageUrl: string): Promise<UserEntity> {
    return this.userRepository.save({ id: userId, imageUrl });
  }

  updateName(userId: string, name: string): Promise<UserEntity> {
    return this.userRepository.save({ id: userId, name });
  }

  updateUsername(userId: string, username: string): Promise<UserEntity> {
    return this.userRepository.save({ id: userId, username });
  }

  updateAdmin(userId: string, isAdmin: boolean): Promise<UserEntity> {
    return this.userRepository.save({ id: userId, isAdmin });
  }
}
