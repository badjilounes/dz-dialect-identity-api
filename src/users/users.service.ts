import { Injectable, NotFoundException } from '@nestjs/common';

import { UserResponseDto } from './dto/user-response-dto';
import { UserInformation } from './user-information';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(provider: ProvidersEnum, user: UserInformation, externalId?: string): Promise<UserEntity> {
    if (provider === ProvidersEnum.Basic) {
      return this.usersRepository.createFromBasicProvider(user.username, user.password);
    } else {
      const username = await this.findUniqueUsername(user.username);
      return this.usersRepository.createFromExternalProvider({ ...user, username }, externalId, provider);
    }
  }

  async findUser(username: string, password?: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOneByUsername(username);

    if (user?.provider === ProvidersEnum.Basic && !this.usersRepository.checkPassword(user, password)) {
      return null;
    }

    return user;
  }

  async findUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }

    return {
      id: user.id,
      provider: user.provider,
      username: user.username,
      createdAt: user.createdAt,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      externalId: user.externalId ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
    };
  }

  async usernameExists(username: string): Promise<boolean> {
    return !!(await this.usersRepository.findOneByUsername(username));
  }

  private async findUniqueUsername(username: string): Promise<string> {
    let uniqueUsername = username;
    let i = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await this.usersRepository.findOneByUsername(uniqueUsername)) {
      uniqueUsername = `${username}${i}`;
      i++;
    }

    return uniqueUsername;
  }
}
