import { InspectionType } from "src/enums/inspec-type.enum";
import { EvaluationEntity } from "src/evaluation/entities/evaluation.entity";
import { InspectionEntity } from "src/inspection/entites/inspection.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EvaluationPointEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "enum", enum: InspectionType })
  type: InspectionType;

  @ManyToMany(() => InspectionEntity, inspection => inspection.evaluationPoints)
  inspections: InspectionEntity[];

  @OneToMany(() => EvaluationEntity, inspectionEvaluation => inspectionEvaluation.evaluationPoint)
  Evaluations: EvaluationEntity[];
}
