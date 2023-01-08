import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FindManyOptions, ILike } from 'typeorm';

import { UserResponseDto } from './dto/user-response-dto';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './users.repository';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';
import { PaginatedUserResponseDto } from 'src/users/dto/paginated-user-response-dto';

@Injectable()
export class UsersAdminService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAll(pageIndex: number, pageSize: number, query: string): Promise<PaginatedUserResponseDto> {
    const options: FindManyOptions<UserEntity> = {
      skip: pageIndex * pageSize,
      take: pageSize,
    };

    if (query) {
      options.where = [
        { email: ILike(`%${query}%`) },
        { username: ILike(`%${query}%`) },
        { name: ILike(`%${query}%`) },
      ];
    }

    const [entities, length] = await this.usersRepository.paginate(options);

    return {
      elements: entities.map((user) => this.getUserResponseDtoFromUser(user)),
      length,
      pageIndex,
      pageSize,
    };
  }

  async updateAdmin(userId: string, isAdmin: boolean): Promise<void> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }

    await this.usersRepository.updateAdmin(userId, isAdmin);
  }

  async me(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException("Cet utilisateur n'existe pas");
    }

    if (!user.isAdmin) {
      throw new UnauthorizedException("Vous n'avez pas les droits d'administration");
    }

    return this.getUserResponseDtoFromUser(user);
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
      isAdmin: user.isAdmin,
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
