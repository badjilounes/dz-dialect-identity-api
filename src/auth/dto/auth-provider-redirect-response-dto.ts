import { ApiProperty } from '@nestjs/swagger';

export class AuthProviderRedirectResponseDto {
  @ApiProperty()
  url: string;
}
