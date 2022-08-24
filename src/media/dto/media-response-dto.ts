import { ApiProperty } from '@nestjs/swagger';

export class MediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;
}
