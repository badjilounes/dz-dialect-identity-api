import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ProvidersEnum } from 'src/auth/providers/providers.enum';

@Entity({ name: 'users_external' })
export class UserExternalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  externalId: string;

  @Column({ enum: ProvidersEnum })
  provider: ProvidersEnum;

  @Column({ nullable: true, unique: true, default: null })
  email: string | null;

  @Column()
  username: string;

  @Column({ nullable: true, default: null })
  name: string | null;

  @Column({ nullable: true, default: null })
  imageUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
