import { BlocEntity } from 'src/bloc/entities/bloc.entity';
import { TimestampEntites } from 'src/generics/timestamp.entites.';
import { InspectionEntity } from 'src/inspection/entites/inspection.entity';
import { InstitutionEntity } from 'src/institution/entities/institution.entity';
import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity({ name: 'unit-inspection' })
export class InspectionUnitEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  code: string;

  @OneToMany(() => InspectionEntity, inspection => inspection.unit)
  inspections: InspectionEntity[];

  @ManyToOne(() => InstitutionEntity, institution => institution.inspectionUnits)
  @JoinColumn({ name: "institutionId" })
  institution: InstitutionEntity;

  @OneToMany(() => BlocEntity, bloc => bloc.inspectionUnit)
  blocs: BlocEntity[];
}