import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InspectionType } from 'src/enums/inspec-type.enum';
import { InspectionService } from 'src/inspection/inspection.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AddEvaluationPointDto } from './dto/add-evaluation-point.dto';
import { UpdateEvaluationPointDto } from './dto/update-evaluation-point.dto';
import { EvaluationPointEntity } from './entities/evaluation-point.entity';

@Injectable()
export class EvaluationPointService {
  constructor(
    @InjectRepository(EvaluationPointEntity)
    private evaluationPointRepository: Repository<EvaluationPointEntity>,
    private userService: UserService,
    private inspectionServise: InspectionService
  ) { }

  async createEvaluationPoint(
    user: UserEntity,
    addEvaluationPointDto: AddEvaluationPointDto,
  ): Promise<Partial<EvaluationPointEntity>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à créer des critères d'inspection");
    }
    try {

      const newPoint = this.evaluationPointRepository.create({
        ...addEvaluationPointDto
      });

      return await this.evaluationPointRepository.save(newPoint);
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la création d'un point d'évaluation.", error.message);
    }
  }

  async getAllEvaluationPoints(): Promise<EvaluationPointEntity[]> {
    try {
      const queryBuilder = this.evaluationPointRepository.createQueryBuilder('evaluationPoint');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la récupération des points d'évaluation.", error.message);
    }
  }

  async getEvaluationPointById(id: number, user: UserEntity): Promise<EvaluationPointEntity> {
    const query = this.evaluationPointRepository.createQueryBuilder('evaluationPoint')
      .leftJoinAndSelect('evaluationPoint.evaluations', 'evaluation')
      .leftJoinAndSelect('evaluation.inspection', 'inspection')
      .where('evaluationPoint.id = :id', { id });

    //query.andWhere('inspection.userId = :userId', { userId: user.id });
  
    const evaluationPoint = await query.getOne();
  
    if (!evaluationPoint) {
      throw new NotFoundException(`Le point d'évaluation avec l'ID ${id} n'existe pas`);
    }
  
    return evaluationPoint;
  }

  async getPointsByType(type: InspectionType): Promise<EvaluationPointEntity[]> {
    // Vérifier que le type d'inspection est valide
    if (!Object.values(InspectionType).includes(type)) {
      throw new BadRequestException(`Le type d'inspection '${type}' n'est pas valide`);
    }

    // Récupérer tous les points d'évaluation avec le type correspondant
    return await this.evaluationPointRepository.find({
      where: {
        type: type
      }
    });
  }


  async getEvaluationPointsByIds(evaluationPointIds: number[]): Promise<EvaluationPointEntity[]> {
    const evaluationPoints = await this.evaluationPointRepository.createQueryBuilder('point')
      .where('point.id IN (:...evaluationPointIds)', { evaluationPointIds })
      .getMany();
    return evaluationPoints;
  }




  async updateEvaluationPoint(user: UserEntity, id: number, updateEvaluationPointDto: UpdateEvaluationPointDto): Promise<EvaluationPointEntity> {
    // Vérifier si l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }
    try {
      // Récupérer l'évaluation point spécifique en utilisant son ID
      let evaluationPoint = await this.getEvaluationPointById(id, user);

      // Mettre à jour les champs de l'évaluation point avec les valeurs fournies dans l'objet updateEvaluationPointDto
      evaluationPoint = this.evaluationPointRepository.merge(evaluationPoint, updateEvaluationPointDto);

      // Sauvegarder les modifications dans la base de données
      return await this.evaluationPointRepository.save(evaluationPoint);
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la mise à jour de l'évaluation point.", error.message);
    }

  }

  async softDeleteEvaluationPoint(user: UserEntity, evaluationPointId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    /*   // Récupérer le point d'évaluation spécifique en utilisant son ID
      const evaluationPoint = await this.getEvaluationPointById( evaluationPointId,user);
      if (!evaluationPoint) {
        throw new NotFoundException('Point d\'évaluation introuvable.');
      } */

    // Marquer le point d'évaluation comme "supprimé" en le soft-deletant
    const result = await this.evaluationPointRepository.softDelete({ id: evaluationPointId });

    // Vérifier si le point d'évaluation a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le point d'évaluation avec l'ID ${evaluationPointId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `Le point d'évaluation a été supprimé avec succès.`;
  }

  async restoreEvaluationPoint(user: UserEntity, evaluationPointId: number): Promise<EvaluationPointEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Restaurer le point d'évaluation supprimé en utilisant son ID
    const result = await this.evaluationPointRepository.restore({ id: evaluationPointId });

    // Vérifier si le point d'évaluation a été restauré
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le point d'évaluation avec l'ID ${evaluationPointId}.`);
    }

    // Récupérer le point d'évaluation restauré
    const restoredEvaluationPoint = await this.getEvaluationPointById(evaluationPointId, user);

    // Retourner le point d'évaluation restauré
    return restoredEvaluationPoint;
  }

  async deleteEvaluationPoint(user: UserEntity, evaluationPointId: number): Promise<any> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Supprimer le point d'évaluation de la base de données
    const result = await this.evaluationPointRepository.delete(evaluationPointId);

    // Vérifier si le point d'évaluation a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le point d'évaluation avec l'ID ${evaluationPointId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return {message:"Le point d'évaluation a été supprimé avec succès."};
  }



}
