import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserInformation } from './user-information';
import { UserEntity } from './user.entity';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUserFromProvider(
    user: UserInformation,
    externalId: string,
    provider: ProvidersEnum,
  ): Promise<UserEntity> {
    const existing = await this.usersRepository.findOne({
      where: {
        provider,
        externalId,
      },
    });

    const toSave = this.usersRepository.create({ ...existing, ...user, provider, externalId });

    return this.usersRepository.save(toSave);
  }
}
