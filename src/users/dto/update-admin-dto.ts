import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  isAdmin: boolean;
}
