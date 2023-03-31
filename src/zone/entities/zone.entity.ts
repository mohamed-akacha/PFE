import { InstitutionEntity } from "src/institution/entities/institution.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";


@Entity({ name: 'zone' })
export class ZoneEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @OneToMany(() => InstitutionEntity, institution => institution.zone)
  institutions: InstitutionEntity[];
}
