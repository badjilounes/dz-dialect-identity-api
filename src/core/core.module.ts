import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppDatabaseModule } from './app-database/app-typeorm.module';
import { AppWinstonModule } from './app-winston/app-winston.module';

@Global()
@Module({
  imports: [AppWinstonModule, AppDatabaseModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class CoreModule {}
