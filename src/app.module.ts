import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MediaModule, UsersModule, AuthModule, CoreModule],
})
export class AppModule {}
