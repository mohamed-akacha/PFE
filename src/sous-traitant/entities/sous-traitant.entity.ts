import { Contrat } from 'src/contrat/entities/contrat.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';

@Entity({name:'SousTraitants'})
export class SousTraitantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom_contact: string;

  @Column()
  tel_contact: string;

  @Column()
  email_contact: string;

  @Column()
  raison_sociale: string;

  @OneToMany(() => Contrat, contrat => contrat.sousTraitant,{nullable: true, })
  @JoinTable()
  contrats: Contrat[];

}