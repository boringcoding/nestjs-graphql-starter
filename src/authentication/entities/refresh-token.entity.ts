import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  is_revoked: boolean;

  @Column()
  expires: Date;
}
