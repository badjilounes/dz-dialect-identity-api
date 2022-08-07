import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponseDto {
  @ApiProperty()
  token: string;
}
