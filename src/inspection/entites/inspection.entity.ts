import { InspectionType } from "src/enums/inspec-type.enum";
import { EvaluationEntity } from "src/evaluation/entities/evaluation.entity";
import { TimestampEntites } from "src/Generics/timestamp.entites.";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'inspection'})
export class InspectionEntity extends TimestampEntites {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  @Column()
  datePrevue: Date;

  @Column()
  dateInspection?: Date;

  @Column({ default: false })
  statut: boolean;

  @Column({ type: "enum", enum: InspectionType })
  type: InspectionType;

  @ManyToOne(() => UserEntity, user => user.inspections , {nullable: true, })
  user: UserEntity;

  @OneToMany(() => EvaluationEntity, evaluation => evaluation.inspection)
  evaluations: EvaluationEntity[];
}
