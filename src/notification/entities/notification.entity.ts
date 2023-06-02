import { TimestampEntites } from 'src/generics/timestamp.entites.';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity({ name: 'notification' })
export class NotificationEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  read: boolean;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  inspectionId: number;

  @Column(/* { nullable: true } */)
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}
