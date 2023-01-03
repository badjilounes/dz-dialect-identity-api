import { Body, Controller, Get, Param, Post, Query, Redirect } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthProviderRedirectResponseDto } from './dto/auth-provider-redirect-response-dto';
import { AuthSignInDto } from './dto/auth-sign-in-dto';
import { AuthTokenResponseDto } from './dto/auth-sign-up-response-dto';

import { AuthAdminService } from 'src/auth/auth-admin.service';

@ApiTags('Authentication')
@Controller('authentication/admin')
export class AuthAdminController {
  constructor(private readonly authenticationAdminService: AuthAdminService) {}

  @ApiOperation({
    operationId: 'admin-redirect-to-authorize-url',
    summary: 'Redirects admin to provider authorize URL',
  })
  @Get(':providerName')
  @ApiBadRequestResponse({ description: 'Provider not found' })
  adminRedirectToProviderAuthorizeURL(@Param('providerName') providerName: string): AuthProviderRedirectResponseDto {
    return { url: this.authenticationAdminService.getAuthorizeURL(providerName) };
  }

  @ApiOperation({ operationId: 'admin-provider-callback', summary: 'Provider login callback' })
  @Get(':providerName/callback')
  @Redirect()
  @ApiBadRequestResponse({ description: 'Provider not found' })
  async adminProviderCallback(
    @Param('providerName') providerName: string,
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    const url = await this.authenticationAdminService.getRedirectURIFromCode(providerName, code, error);
    return { url, statusCode: 301 };
  }

  @ApiOperation({ operationId: 'admin-sign-in', summary: 'Sign in admin' })
  @Post('sign-in')
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  adminSignIn(@Body() user: AuthSignInDto): Promise<AuthTokenResponseDto> {
    return this.authenticationAdminService.signIn(user);
  }
}
