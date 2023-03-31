import { InspectionUnitEntity } from "src/inspection-unit/entities/inspection-unit.entity";
import { ZoneEntity } from "src/zone/entities/zone.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: 'institution' })
export class InstitutionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  adresse: string;

  @Column()
  nature: string;

  @ManyToOne(() => ZoneEntity, zone => zone.institutions)
  zone: ZoneEntity;
  @OneToMany(() => InspectionUnitEntity, inspectionUnit => inspectionUnit.institution)
  inspectionUnits: InspectionUnitEntity[];
}
