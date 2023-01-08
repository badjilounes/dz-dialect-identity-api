import { ApiProperty } from '@nestjs/swagger';

export class GetAllUsersDto {
  @ApiProperty()
  pageIndex: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  query: string;
}
