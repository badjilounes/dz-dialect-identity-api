import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Client, { auth } from 'twitter-api-sdk';

import { AuthProvider, UserProviderInformation } from '../auth-provider';

@Injectable()
export class TwitterAuthClientService implements AuthProvider {
  private readonly authClient = new auth.OAuth2User({
    client_id: this.configService.get('TWITTER_CLIENT_ID'),
    client_secret: this.configService.get('TWITTER_CLIENT_SECRET'),
    callback: this.configService.get('TWITTER_REDIRECT_URI'),
    scopes: ['tweet.read', 'users.read', 'offline.access'],
  });

  private readonly twitterClient = new Client(this.authClient);

  get authorizeUrl(): string {
    return this.authClient.generateAuthURL({
      state: this.configService.get('TWITTER_STATE'),
      code_challenge: this.configService.get('TWITTER_CODE_CHALLENGE'),
      code_challenge_method: this.configService.get('TWITTER_CODE_CHALLENGE_METHOD'),
    });
  }

  constructor(private readonly configService: ConfigService) {}

  async getUserInformation(code: string): Promise<UserProviderInformation> {
    await this.authClient.requestAccessToken(code);

    const response = await this.twitterClient.users.findMyUser(
      { 'user.fields': ['profile_image_url'] },
      { auth: this.authClient },
    );

    return {
      id: response.data.id,
      information: {
        username: response.data.username,
        name: response.data.name,
        imageUrl: response.data.profile_image_url,
      },
    };
  }
}
