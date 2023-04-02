import { InstitutionEntity } from "src/institution/entities/institution.entity";
import { SousTraitantEntity } from "src/sous-traitant/entities/sous-traitant.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'contrats'})
export class Contrat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date_debut: Date;

  @Column()
  duree: number;

  @ManyToOne(() => InstitutionEntity, institution => institution.contrats)
  institution: InstitutionEntity;

  @ManyToOne(() => SousTraitantEntity, sousTraitant => sousTraitant.contrats)
  sousTraitant: SousTraitantEntity;
}