import { Controller, Get, Param, Query, Redirect } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @ApiOperation({ operationId: 'redirect-to-authorize-url', summary: 'Redirects user to provider authorize URL' })
  @Get(':providerName')
  @Redirect()
  redirectToProviderAuthorizeURL(@Param('providerName') providerName: string) {
    return { url: this.authenticationService.getAuthorizeURL(providerName), statusCode: 302 };
  }

  @ApiOperation({ operationId: 'provider-callback', summary: 'Provider login callback' })
  @Get(':providerName/callback')
  @Redirect()
  async providerCallback(@Param('providerName') providerName: string, @Query('code') code: string) {
    const url = await this.authenticationService.getRedirectURIFromCode(providerName, code);

    return { url, statusCode: 302 };
  }
}
