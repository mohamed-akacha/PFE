import { InspectionEntity } from 'src/inspection/entites/inspection.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'unit-inspection'})
export class InspectionUnitEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  libelle: string;

  @Column()
  code: string;

  @OneToMany(() => InspectionEntity, inspection => inspection.unit)
  inspections: InspectionEntity[];
}
