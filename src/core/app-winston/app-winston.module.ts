import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { AppWinstonModuleOptionsFactory } from './app-winston-module-options.factory';

const factoryImports = [ConfigModule];
@Global()
@Module({
  imports: [
    ...factoryImports,
    WinstonModule.forRootAsync({
      imports: factoryImports,
      inject: [ConfigService],
      useClass: AppWinstonModuleOptionsFactory,
    }),
  ],
  providers: [AppWinstonModuleOptionsFactory],
})
export class AppWinstonModule {}
