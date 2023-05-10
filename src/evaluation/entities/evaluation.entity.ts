import { Max, Min } from "class-validator";
import { BlocEntity } from "src/bloc/entities/bloc.entity";
import { EvaluationPointEntity } from "src/evaluation-point/entities/evaluation-point.entity";
import { TimestampEntites } from "src/generics/timestamp.entites.";
import { InspectionEntity } from "src/inspection/entites/inspection.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'evaluations'})
export class EvaluationEntity extends TimestampEntites {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Min(0)
  @Max(10)
  score: number;

  @Column({ nullable: true })
  pieceJointe?: string;


  @Column()
  inspectionId: number;
  @ManyToOne(() => InspectionEntity, inspection => inspection.evaluations)
  @JoinColumn({ name: 'inspectionId' })
  inspection: InspectionEntity;




  @Column()
  evaluationPointId: number;
  @ManyToOne(() => EvaluationPointEntity)
  @JoinColumn({ name: 'evaluationPointId' })
  evaluationPoint: EvaluationPointEntity;

 


  @Column()
  blocId: number;
  @ManyToOne(() => EvaluationEntity,{ onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'blocId' })
  bloc: BlocEntity;
}


