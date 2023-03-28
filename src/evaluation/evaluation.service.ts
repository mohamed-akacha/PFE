import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EvaluationEntity } from './entities/evaluation.entity';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly evaluationRepository: Repository<EvaluationEntity>,
  ) {}

  
  async save(evaluations: EvaluationEntity[]): Promise<EvaluationEntity[]> {
    const entityManager = this.evaluationRepository.manager;
  
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
  }
  
}
