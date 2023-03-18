import { EvaluationPointEntity } from "src/evaluation-point/entities/evaluation-point.entity";
import { TimestampEntites } from "src/generics/timestamp.entites.";
import { InspectionEntity } from "src/inspection/entites/inspection.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'evaluation'})
export class EvaluationEntity extends TimestampEntites {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({ nullable: true })
  pieceJointe: string;

  @ManyToOne(() => InspectionEntity, inspection => inspection.evaluations,{ nullable: true })
  inspection: InspectionEntity;

  @ManyToOne(() => EvaluationPointEntity, evaluationPoint => evaluationPoint.evaluations)
  evaluationPoint: EvaluationPointEntity;
}
