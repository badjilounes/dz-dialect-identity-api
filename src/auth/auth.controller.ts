import { Body, Controller, Get, Param, Post, Query, Redirect } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthProviderRedirectResponseDto } from './dto/auth-provider-redirect-response-dto';
import { AuthSignInDto } from './dto/auth-sign-in-dto';
import { AuthSignUpDto } from './dto/auth-sign-up-dto';
import { AuthTokenResponseDto } from './dto/auth-sign-up-response-dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @ApiOperation({ operationId: 'redirect-to-authorize-url', summary: 'Redirects user to provider authorize URL' })
  @Get(':providerName')
  @ApiBadRequestResponse({ description: 'Provider not found' })
  redirectToProviderAuthorizeURL(@Param('providerName') providerName: string): AuthProviderRedirectResponseDto {
    return { url: this.authenticationService.getAuthorizeURL(providerName) };
  }

  @ApiOperation({ operationId: 'provider-callback', summary: 'Provider login callback' })
  @Get(':providerName/callback')
  @Redirect()
  @ApiBadRequestResponse({ description: 'Provider not found' })
  async providerCallback(
    @Param('providerName') providerName: string,
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    const url = await this.authenticationService.getRedirectURIFromCode(providerName, code, error);

    return { url, statusCode: 301 };
  }

  @ApiOperation({ operationId: 'sign-up', summary: 'Sign up a new user' })
  @Post('sign-up')
  @ApiBadRequestResponse({ description: 'Invalid user data' })
  @ApiResponse({ status: 201, type: AuthTokenResponseDto })
  signUp(@Body() user: AuthSignUpDto): Promise<AuthTokenResponseDto> {
    return this.authenticationService.signUp(user);
  }

  @ApiOperation({ operationId: 'sign-in', summary: 'Sign in user' })
  @Post('sign-in')
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  signIn(@Body() user: AuthSignInDto): Promise<AuthTokenResponseDto> {
    return this.authenticationService.signIn(user);
  }

  @ApiOperation({
    operationId: 'admin-redirect-to-authorize-url',
    summary: 'Redirects admin to provider authorize URL',
  })
  @Get('admin/:providerName')
  @ApiBadRequestResponse({ description: 'Provider not found' })
  adminRedirectToProviderAuthorizeURL(@Param('providerName') providerName: string): AuthProviderRedirectResponseDto {
    return { url: this.authenticationService.getAdminAuthorizeURL(providerName) };
  }

  @ApiOperation({ operationId: 'admin-provider-callback', summary: 'Provider login callback' })
  @Get('admin/:providerName/callback')
  @Redirect()
  @ApiBadRequestResponse({ description: 'Provider not found' })
  async adminProviderCallback(
    @Param('providerName') providerName: string,
    @Query('code') code?: string,
    @Query('error') error?: string,
  ) {
    const url = await this.authenticationService.getAdminRedirectURIFromCode(providerName, code, error);
    return { url, statusCode: 301 };
  }

  @ApiOperation({ operationId: 'admin-sign-in', summary: 'Sign in admin' })
  @Post('admin/sign-in')
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiOkResponse({ type: AuthTokenResponseDto })
  adminSignIn(@Body() user: AuthSignInDto): Promise<AuthTokenResponseDto> {
    return this.authenticationService.signIn(user);
  }
}
