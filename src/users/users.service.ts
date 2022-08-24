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

    const existingUserExternal = await this.usersExternalRepository.findOne({
      where: {
        provider,
        externalId,
      },
    });

    let createdUser: UserEntity;

    if (existingUserExternal) {
      // Update user external entity
      await this.usersExternalRepository.update(existingUserExternal.id, user);
      createdUser = await this.usersRepository.findOneByUserExternalId(existingUserExternal.id);
    } else {
      // create user with external entity
      const userExternal = await this.usersExternalRepository.save({ provider, externalId, ...user });
      const username = await this.buildUniqueUsername(user.username);
      createdUser = await this.usersRepository.createFromExternalProvider(username, userExternal);
    }

    return createdUser;
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

    if (!user.userExternal && !this.usersRepository.checkPassword(user, password)) {
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

  private getUserResponseDtoFromUser(user: UserEntity): UserResponseDto {
    const response: UserResponseDto = {
      id: user.id,
      externalId: undefined,
      provider: ProvidersEnum.Basic,
      username: user.username,
      createdAt: user.createdAt,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    };

    const external = user.userExternal;

    if (external) {
      response.provider = external.provider;
      response.externalId = external.externalId;
      response.name = response.name ?? external.name;
      response.email = response.email ?? external.email;
      response.imageUrl = response.imageUrl ?? external.imageUrl;
    }

    response.name = response.name ?? undefined;
    response.email = response.email ?? undefined;
    response.imageUrl = response.imageUrl ?? undefined;

    return response;
  }
}
