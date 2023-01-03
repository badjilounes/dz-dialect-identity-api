import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthSignInDto } from './dto/auth-sign-in-dto';
import { AuthTokenResponseDto } from './dto/auth-sign-up-response-dto';
import { AuthProvider, UserProviderInformation } from './providers/auth-provider';
import { GoogleAuthProviderService } from './providers/google/google-auth-provider.service';
import { ProvidersEnum } from './providers/providers.enum';
import { TwitterAuthClientService } from './providers/twitter/twitter-auth-provider.service';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthAdminService {
  private readonly adminAppCallbackURL = this.configService.get('ADMIN_APP_CALLBACK_URL');
  private readonly adminAppSignInURL = this.configService.get('ADMIN_APP_SIGN_IN_URL');

  private readonly providers: Map<ProvidersEnum, AuthProvider> = new Map<ProvidersEnum, AuthProvider>([
    [ProvidersEnum.Twitter, this.twitterAuthClient],
    [ProvidersEnum.Google, this.googleAuthClient],
  ]);

  constructor(
    private readonly configService: ConfigService,
    private readonly twitterAuthClient: TwitterAuthClientService,
    private readonly googleAuthClient: GoogleAuthProviderService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  getAuthorizeURL(providerName: string) {
    return this.resolveProviderFromName(providerName).adminAuthorizeUrl;
  }

  async getRedirectURIFromCode(providerName: string, code?: string, error?: string) {
    if (error) {
      return this.adminAppSignInURL;
    }

    const provider = this.resolveProviderFromName(providerName);
    const userFromProvider: UserProviderInformation = await provider.getAdminUserInformation(code);

    const existingUserExternal = await this.usersService.checkExternalUser(
      providerName as ProvidersEnum,
      userFromProvider.id,
    );

    if (!existingUserExternal || !existingUserExternal.isAdmin) {
      return `${this.adminAppSignInURL}?error=Vous n'avez pas les droits d'administration`;
    }

    const accessToken = this.jwtService.sign({ id: existingUserExternal.id });
    return `${this.adminAppCallbackURL}?access_token=${accessToken}`;
  }

  async signIn(user: AuthSignInDto): Promise<AuthTokenResponseDto> {
    const found = await this.usersService.checkUser(user.username, user.password);

    if (!found) {
      throw new UnauthorizedException('Nom de compte ou mot de passe invalide');
    }

    if (!found.isAdmin) {
      throw new UnauthorizedException("Vous n'avez pas les droits d'administration");
    }

    return {
      token: this.jwtService.sign({ id: found.id }),
    };
  }

  private resolveProviderFromName(providerName: string): AuthProvider {
    const provider = this.providers.get(providerName as ProvidersEnum);

    if (!provider) {
      throw new BadRequestException(`Le fournisseur d'identité ${providerName} n'est pas supporté`);
    }

    return provider;
  }
}
