import { Contrat } from "src/contrat/entities/contrat.entity";
import { TimestampEntites } from "src/generics/timestamp.entites.";
import { InspectionUnitEntity } from "src/inspection-unit/entities/inspection-unit.entity";
import { ZoneEntity } from "src/zone/entities/zone.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from "typeorm";

@Entity({ name: 'institutions' })
export class InstitutionEntity extends TimestampEntites{
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


  @OneToMany(() => InspectionUnitEntity, inspectionUnit => inspectionUnit.institution ,{nullable: true, })
  inspectionUnits: InspectionUnitEntity[];

  @OneToMany(() => Contrat, contrat => contrat.institution,{nullable: true, })
  contrats: Contrat[];
}
