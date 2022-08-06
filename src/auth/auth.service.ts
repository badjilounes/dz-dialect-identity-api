import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthProvider, UserProviderInformation } from './providers/auth-provider';
import { ProvidersEnum } from './providers/providers.enum';
import { TwitterAuthClientService } from './providers/twitter/twitter-auth-provider.service';

import { UserInformation } from 'src/users/user-information';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly appCallbackURL = this.configService.get('APP_CALLBACK_URL');

  private readonly providers: Map<ProvidersEnum, AuthProvider> = new Map([
    [ProvidersEnum.Twitter, this.twitterAuthClient],
  ]);

  constructor(
    private readonly configService: ConfigService,
    private readonly twitterAuthClient: TwitterAuthClientService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  getAuthorizeURL(providerName: string) {
    const provider = this.resolveProviderFromName(providerName);

    return provider.authorizeUrl;
  }

  async getRedirectURIFromCode(providerName: string, code: string) {
    const provider = this.resolveProviderFromName(providerName);

    const {
      name,
      username,
      imageUrl,
      id: externalId,
    }: UserProviderInformation = await provider.getUserInformation(code);

    const userInformation: UserInformation = { name, username, imageUrl };
    const createdUser = await this.usersService.createUserFromProvider(
      userInformation,
      externalId,
      ProvidersEnum.Twitter,
    );

    const accessToken = this.jwtService.sign({ id: createdUser.id });

    return `${this.appCallbackURL}?access_token=${accessToken}`;
  }

  private resolveProviderFromName(providerName: string): AuthProvider {
    const provider = this.providers.get(providerName as ProvidersEnum);

    if (!provider) {
      throw new BadRequestException(`Provider ${providerName} is not supported`);
    }

    return provider;
  }
}
