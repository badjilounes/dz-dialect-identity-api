import { ApiProperty } from '@nestjs/swagger';

export class UpdateNameDto {
  @ApiProperty()
  name: string;
}
