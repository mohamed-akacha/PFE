import { EvaluationPointEntity } from "src/evaluation-point/entities/evaluation-point.entity";
import { InspectionEntity } from "src/inspection/entites/inspection.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EvaluationEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({nullable: true})
  piece_jointe: string;


  
  @ManyToOne(() => InspectionEntity, inspection => inspection.Evaluations)
  inspection: InspectionEntity;

  @ManyToOne(() => EvaluationPointEntity, evaluationPoint => evaluationPoint.Evaluations)
  evaluationPoint: EvaluationPointEntity;

}
