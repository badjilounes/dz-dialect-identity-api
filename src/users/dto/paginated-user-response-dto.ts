import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from 'src/users/dto/user-response-dto';

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  elements: UserResponseDto[];

  @ApiProperty()
  length: number;

  @ApiProperty()
  pageIndex: number;

  @ApiProperty()
  pageSize: number;
}
