import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthPassThroughGuard } from './jwt/jwt-auth-pass-through.guard';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtStrategy } from './jwt/jwt.strategy';
import { GoogleAuthProviderService } from './providers/google/google-auth-provider.service';
import { TwitterAuthClientService } from './providers/twitter/twitter-auth-provider.service';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TwitterAuthClientService,
    GoogleAuthProviderService,
    JwtAuthGuard,
    JwtStrategy,
    JwtAuthPassThroughGuard,
  ],
})
export class AuthModule {}
