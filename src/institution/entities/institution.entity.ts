import { TimestampEntites } from "src/generics/timestamp.entites.";
import { InspectionUnitEntity } from "src/inspection-unit/entities/inspection-unit.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'institution' })
export class InstitutionEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  adresse: string;

  @Column()
  nature: string;

  @OneToMany(() => InspectionUnitEntity, inspectionUnit => inspectionUnit.institution)
  inspectionUnits: InspectionUnitEntity[];
}