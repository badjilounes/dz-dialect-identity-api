import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthSignInDto } from './dto/auth-sign-in-dto';
import { AuthSignUpDto } from './dto/auth-sign-up-dto';
import { AuthTokenResponseDto } from './dto/auth-sign-up-response-dto';
import { AuthProvider, UserProviderInformation } from './providers/auth-provider';
import { GoogleAuthProviderService } from './providers/google/google-auth-provider.service';
import { ProvidersEnum } from './providers/providers.enum';
import { TwitterAuthClientService } from './providers/twitter/twitter-auth-provider.service';

import { UserInformation } from 'src/users/user-information';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly appCallbackURL = this.configService.get('APP_CALLBACK_URL');
  private readonly appSignInURL = this.configService.get('APP_SIGN_IN_URL');

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
    return this.resolveProviderFromName(providerName).authorizeUrl;
  }

  async getRedirectURIFromCode(providerName: string, code?: string, error?: string) {
    if (error) {
      return this.appSignInURL;
    }

    const provider = this.resolveProviderFromName(providerName);

    const userFromProvider: UserProviderInformation = await provider.getUserInformation(code);
    const user = await this.usersService.createUser(
      providerName as ProvidersEnum,
      userFromProvider.information,
      userFromProvider.id,
    );

    const accessToken = this.jwtService.sign({ id: user.id });

    return `${this.appCallbackURL}?access_token=${accessToken}`;
  }

  async signIn(user: AuthSignInDto): Promise<AuthTokenResponseDto> {
    const found = await this.usersService.checkUser(user.username, user.password);

    if (!found) {
      throw new UnauthorizedException('Nom de compte ou mot de passe invalide');
    }

    return {
      token: this.jwtService.sign({ id: found.id }),
    };
  }

  async signUp(user: AuthSignUpDto): Promise<AuthTokenResponseDto> {
    const usernameExists = await this.usersService.usernameExists(user.username);
    if (usernameExists) {
      throw new ConflictException('Ce nom de compte existe déjà');
    }

    const information: UserInformation = { username: user.username, password: user.password };
    const created = await this.usersService.createUser(ProvidersEnum.Basic, information);
    return {
      token: this.jwtService.sign({ id: created.id }),
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
