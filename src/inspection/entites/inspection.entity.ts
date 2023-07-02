import { InspectionType } from "src/enums/inspec-type.enum";
import { EvaluationEntity } from "src/evaluation/entities/evaluation.entity";
import { TimestampEntites } from "src/generics/timestamp.entites.";
import { InspectionUnitEntity } from "src/inspection-unit/entities/inspection-unit.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'inspections'})
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

  @ManyToOne(() => UserEntity, user => user.inspections , { nullable: true, onDelete: 'SET NULL' })
  user: UserEntity;

  @OneToMany(() => EvaluationEntity, evaluation => evaluation.inspection ,{ nullable: true })
  evaluations: EvaluationEntity[];

 

  @Column()
  unitId: number;
  @ManyToOne(() => InspectionUnitEntity,{nullable: true, })
  @JoinColumn({ name: 'unitId' })
  unit: InspectionUnitEntity;
}




