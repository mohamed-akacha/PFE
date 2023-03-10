import { InspectionType } from "src/enums/inspec-type.enum";
import { EvaluationEntity } from "src/evaluation/entities/evaluation.entity";
import { TimestampEntites } from "src/Generics/timestamp.entites.";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'point-evaluation'})
export class EvaluationPointEntity extends TimestampEntites {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "enum", enum: InspectionType })
  type: InspectionType;

  @OneToMany(() => EvaluationEntity, evaluation => evaluation.evaluationPoint)
  evaluations: EvaluationEntity[];
}
