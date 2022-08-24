import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from 'src/users/entities/user.entity';

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

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
