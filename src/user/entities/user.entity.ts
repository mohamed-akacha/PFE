import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../generics/timestamp.entites.';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { InspectionEntity } from 'src/inspection/entites/inspection.entity';
import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({name: 'users'})
export class UserEntity extends TimestampEntites{

  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ example: 1, description: 'The age of the Cat' })
  @Column({
    unique: true,nullable:true
  })
  username: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({nullable:true})
  @IsPhoneNumber()
  tel: string;
  
  @Column({nullable:true})
  @Exclude()
  password: string;

  @Column({nullable:true})
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
