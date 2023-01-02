import { ApiProperty } from '@nestjs/swagger';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: String })
  imageUrl?: string;

  @ApiProperty({ type: String })
  name?: string;

  @ApiProperty({ type: String })
  email?: string;

  @ApiProperty({ enum: ProvidersEnum, enumName: 'ProvidersEnum' })
  provider: ProvidersEnum;

  @ApiProperty({ type: String })
  externalId?: string;
}
