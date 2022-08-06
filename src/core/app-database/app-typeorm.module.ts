import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppWinstonModule } from '../app-winston/app-winston.module';

import { AppTypeormLogger } from './app-typeorm.logger';

@Module({
  imports: [
    AppWinstonModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        logger: new AppTypeormLogger(),
      }),
    }),
  ],
})
export class AppDatabaseModule {}
