import { OneToMany, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entites.';
import { UserRoleEnum } from '../../enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { InspectionEntity } from 'src/inspection/entites/inspection.entity';

@Entity('user')
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
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER
  })
  role: string;

  @OneToMany(() => InspectionEntity, 
  inspection => inspection.user,
  {
    nullable: true,
  })
  inspections: InspectionEntity[];
  /* @OneToMany(
    type => CvEntity,
    (cv) => cv.user,
    {
      nullable: true,
      cascade: true
    }
  )
  cvs: CvEntity[]; */
}
