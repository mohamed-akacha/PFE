import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, TypeORMError } from 'typeorm';
import { EvaluationEntity } from './entities/evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
  ) {}




  async saveEvaluation(
    evaluationDto: CreateEvaluationDto,
  ): Promise<EvaluationEntity> {
    const { score, pieceJointe, blocId, evaluationPointId ,inspectionId } = evaluationDto;
    try {
      const evaluation = this.evaluationRepository.create({
        score,
        pieceJointe,
        bloc:{id:blocId},
        evaluationPoint:{id:evaluationPointId},
        inspection:{id:inspectionId},
      });
      return this.evaluationRepository.save(evaluation);
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException(`L'ID fourni ne correspond à aucun enregistrement dans la base de données.`);
      } else if (error instanceof TypeORMError) {
        throw new InternalServerErrorException(`Une erreur s\'est produite lors de l\'enregistrement des évaluations.: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  
  
  /* async saveEvaluation(evaluation: CreateEvaluationDto): Promise<EvaluationEntity> {
   
      const newEvaluation = this.evaluationRepository.create({
        score: evaluation.score,
        pieceJointe: evaluation.pieceJointe,
        evaluationPoint: { id: evaluation.evaluationPointId },
        inspection: { id: evaluation.inspectionId },
        bloc: { id: evaluation.blocId },
      });
    return   await this.evaluationRepository.save(newEvaluation);
    
  
  }
 */
}
   /*  const entityManager = this.evaluationRepository.manager;
  
    try {
      // Démarrez une transaction
      return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
        // Enregistrez les évaluations en utilisant l'option de transaction
        const savedEvaluations = await transactionalEntityManager.save(evaluations, { transaction: true });
        return savedEvaluations;
      });
    } catch (error) {
      // Si une erreur se produit, annulez la transaction
      await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.query('ROLLBACK');
      });
      console.error(error);
      throw new InternalServerErrorException('Une erreur s\'est produite lors de l\'enregistrement de l\'évaluation.');
    } 
  }*/
  

