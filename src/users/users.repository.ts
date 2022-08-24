import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';

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

  async createFromBasicProvider(username: string, password: string): Promise<UserEntity> {
    return this.userRepository.save({
      username,
      password: hashSync(password, +this.configService.get('BCRYPT_SALT_ROUNDS')),
    });
  }

  async createFromExternalProvider(username: string, externalId: string, provider: ProvidersEnum): Promise<UserEntity> {
    const existing = await this.userRepository.findOne({
      where: {
        provider,
        externalId,
      },
    });

    const toSave = this.userRepository.create({ ...existing, username, provider, externalId });

    return this.userRepository.save(toSave);
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findOneByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  updateImageUrl(userId: string, imageUrl: string): Promise<UserEntity> {
    return this.userRepository.save({ id: userId, imageUrl });
  }
}
