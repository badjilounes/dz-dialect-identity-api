import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  externalId: string | null;

  @Column({ nullable: true })
  provider: string | null;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  imageUrl: string;
}
