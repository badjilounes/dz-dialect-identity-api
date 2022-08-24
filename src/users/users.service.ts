import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserResponseDto } from './dto/user-response-dto';
import { UserExternalEntity } from './entities/user-external.entity';
import { UserEntity } from './entities/user.entity';
import { UserInformation } from './user-information';
import { UsersRepository } from './users.repository';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';
import { MediaResponseDto } from 'src/media/dto/media-response-dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserExternalEntity) private readonly usersExternalRepository: Repository<UserExternalEntity>,
    private readonly usersRepository: UsersRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createUser(provider: ProvidersEnum, user: UserInformation, externalId?: string): Promise<UserEntity> {
    if (provider === ProvidersEnum.Basic) {
      return this.usersRepository.createFromBasicProvider(user.username, user.password);
    }

    const existingExternalUser = await this.usersExternalRepository.findOne({
      where: {
        provider,
        externalId,
      },
    });

    const externalUserToSave = this.usersExternalRepository.create({
      ...existingExternalUser,
      ...user,
      provider,
      externalId,
    });

    await this.usersExternalRepository.save(externalUserToSave);

    const username = await this.buildUniqueUsername(user.username);
    return this.usersRepository.createFromExternalProvider(username, externalId, provider);
  }

  async createUserImage(
    userId: string,
    buffer: Buffer,
    mimetype: string,
    originalname: string,
  ): Promise<MediaResponseDto> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }

    return this.mediaService.create(userId, buffer, mimetype, originalname);
  }

  async checkUser(username: string, password?: string): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findOneByUsername(username);

    if (user?.provider === ProvidersEnum.Basic && !this.usersRepository.checkPassword(user, password)) {
      return null;
    }

    return this.getUserResponseDtoFromUser(user);
  }

  async findUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }

    return this.getUserResponseDtoFromUser(user);
  }

  async updateImageUrl(userId: string, imageUrl: string): Promise<void> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }

    await this.usersRepository.updateImageUrl(userId, imageUrl);
  }

  async usernameExists(username: string): Promise<boolean> {
    return !!(await this.usersRepository.findOneByUsername(username));
  }

  private async buildUniqueUsername(username: string): Promise<string> {
    let uniqueUsername = username;
    let i = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await this.usersRepository.findOneByUsername(uniqueUsername)) {
      uniqueUsername = `${username}${i}`;
      i++;
    }

    return uniqueUsername;
  }

  private async getUserResponseDtoFromUser(user: UserEntity): Promise<UserResponseDto> {
    const externalUser = await this.usersExternalRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });

    return {
      id: user.id,
      provider: user.provider,
      externalId: user.externalId ?? undefined,
      username: user.username,
      createdAt: user.createdAt,
      name: externalUser.name ?? user.name ?? undefined,
      email: externalUser.email ?? user.email ?? undefined,
      imageUrl: externalUser.imageUrl ?? user.imageUrl ?? undefined,
    };
  }
}
