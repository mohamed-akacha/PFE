import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../generics/timestamp.entites.';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { InspectionEntity } from 'src/inspection/entites/inspection.entity';
import { IsPhoneNumber } from 'class-validator';

@Entity({name: 'user'})
export class UserEntity extends TimestampEntites{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  username: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  @IsPhoneNumber()
  tel: string;
  
  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({
    type: 'enum', enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: UserRoleEnum;

  @OneToMany(() => InspectionEntity, 
  inspection => inspection.user,
  {
    nullable: true,
  })
  inspections: InspectionEntity[];
  
}
