import { EvaluationEntity } from "src/evaluation/entities/evaluation.entity";
import { TimestampEntites } from "src/generics/timestamp.entites.";
import { InspectionUnitEntity } from "src/inspection-unit/entities/inspection-unit.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";

@Entity({ name: 'blocs' })
export class BlocEntity extends TimestampEntites{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  nom: string;

  @Column()
  etage: number;

  @Column({ nullable: true })
  inspectionUnitId: number;
  @ManyToOne(() => InspectionUnitEntity)
  @JoinColumn({ name: "inspectionUnitId" })
  inspectionUnit: InspectionUnitEntity;

  @OneToMany(() => EvaluationEntity, evaluation => evaluation.bloc)
  evaluations: EvaluationEntity[];
}
