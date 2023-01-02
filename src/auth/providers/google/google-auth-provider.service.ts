import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

import { AuthProvider, UserProviderInformation } from '../auth-provider';

@Injectable()
export class GoogleAuthProviderService implements AuthProvider {
  private readonly authClient = new google.auth.OAuth2(
    this.configService.get('GOOGLE_CLIENT_ID'),
    this.configService.get('GOOGLE_CLIENT_SECRET'),
    this.configService.get('GOOGLE_REDIRECT_URI'),
  );
  private readonly adminAuthClient = new google.auth.OAuth2(
    this.configService.get('GOOGLE_CLIENT_ID'),
    this.configService.get('GOOGLE_CLIENT_SECRET'),
    this.configService.get('ADMIN_GOOGLE_REDIRECT_URI'),
  );

  constructor(private readonly configService: ConfigService) {}

  get authorizeUrl(): string {
    return this.authClient.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });
  }

  get adminAuthorizeUrl(): string {
    return this.adminAuthClient.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });
  }

  async getUserInformation(code: string): Promise<UserProviderInformation> {
    const { tokens } = await this.authClient.getToken(code);
    this.authClient.setCredentials(tokens);

    const { data } = await google
      .oauth2({
        auth: this.authClient,
        version: 'v2',
      })
      .userinfo.get();

    return {
      id: data.id,
      information: {
        username: data.name,
        name: data.name,
        imageUrl: data.picture,
        email: data.email,
      },
    };
  }

  async getAdminUserInformation(code: string): Promise<UserProviderInformation> {
    const { tokens } = await this.adminAuthClient.getToken(code);
    this.adminAuthClient.setCredentials(tokens);

    const { data } = await google
      .oauth2({
        auth: this.adminAuthClient,
        version: 'v2',
      })
      .userinfo.get();

    return {
      id: data.id,
      information: {
        username: data.name,
        name: data.name,
        imageUrl: data.picture,
        email: data.email,
      },
    };
  }
}
