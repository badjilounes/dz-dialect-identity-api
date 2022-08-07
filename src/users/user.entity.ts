import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true, default: null })
  externalId: string | null;

  @Column({ enum: ProvidersEnum, default: ProvidersEnum.Basic })
  provider: ProvidersEnum;

  @Column({ nullable: true, unique: true, default: null })
  email: string | null;

  @Column({ nullable: true, default: null })
  password: string | null;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, default: null })
  name: string | null;

  @Column({ nullable: true, default: null })
  imageUrl: string | null;
}
