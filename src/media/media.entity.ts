import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from 'src/users/user.entity';

@Entity()
export class MediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('bytea')
  data: Buffer;

  @Column()
  mimeType: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => UserEntity)
  user: UserEntity;
}
