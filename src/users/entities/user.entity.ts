import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserExternalEntity } from './user-external.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserExternalEntity, { eager: true })
  @JoinColumn()
  userExternal: UserExternalEntity | null;

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

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
