/*
https://docs.nestjs.com/guards#guards
*/

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtAuthPassThroughGuard } from 'src/auth/jwt/jwt-auth-pass-through.guard';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard extends JwtAuthPassThroughGuard {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.userId;
    if (!userId) {
      throw new UnauthorizedException("Vous n'êtes pas authentifié");
    }

    const user = await this.usersService.findUserById(userId);
    if (!user.isAdmin) {
      throw new UnauthorizedException("Vous n'avez pas les droits d'administration");
    }

    return true;
  }
}
