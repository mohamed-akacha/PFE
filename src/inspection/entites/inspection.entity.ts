import { InspectionType } from "src/enums/inspec-type.enum";
import { EvaluationPointEntity } from "src/evaluation-point/entities/evaluation-point.entity";
import { EvaluationEntity } from "src/evaluation/entities/evaluation.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('inspection')
export class InspectionEntity {

    @PrimaryGeneratedColumn()
    id : number ;

    @Column('text')
    description :string ;

    @Column()
    datePrevue: Date;

    @Column()
    dateInspection : Date;
    
    @Column( {default : false})
    statut: Boolean=false;


    @Column({ type: "enum", enum: InspectionType })
    type: InspectionType;

    @ManyToOne(() => UserEntity, user => user.inspections)
    @JoinColumn({ name: 'id' })
     user: UserEntity;

     @ManyToMany(() => EvaluationPointEntity, evaluationPoint => evaluationPoint.inspections)
     @JoinTable()
     evaluationPoints: EvaluationPointEntity[];

     @OneToMany(() => EvaluationEntity, inspectionEvaluation => inspectionEvaluation.inspection)
     Evaluations: EvaluationEntity[];

}
