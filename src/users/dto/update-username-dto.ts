import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsernameDto {
  @ApiProperty()
  username: string;
}
