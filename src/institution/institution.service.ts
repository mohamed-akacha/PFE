import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InstitutionEntity } from './entities/institution.entity';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,
    private readonly userService: UserService,
  ) { }

  async createInstitution(
    user: UserEntity,
    createInstitutionDto: CreateInstitutionDto,
  ): Promise<InstitutionEntity> {
     // Vérifier si l'utilisateur est autorisé à effectuer cette action
     if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException( "Vous n'êtes pas autorisé à effectuer cette action.");
     }
    try {
      const institution = this.institutionRepository.create({
        ...createInstitutionDto,
        zone: { id: createInstitutionDto.zoneId }
      });
      return this.institutionRepository.save(institution);
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la création d'une institution.", error.message);
    }
  }

  async getAllInstitutions(): Promise<InstitutionEntity[]> {
    try {
      const queryBuilder =  this.institutionRepository.createQueryBuilder('institution');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la récupération des institutions.", error.message);
    }
   
  }

  async getInstitutionById(id: number): Promise<InstitutionEntity> {
    const institution = await this.institutionRepository
      .createQueryBuilder('institution')
      .where('institution.id = :id', { id })
      .getOne();
    return institution;
  }

  async updateInstitution(
    id: number,
    updateInstitutionDto: UpdateInstitutionDto,
    user: UserEntity,
  ): Promise<Partial<InstitutionEntity>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à modifier des institutions.");
    }
    const updatedInstitution = await this.institutionRepository.preload({
      id,
      ...updateInstitutionDto,
    });

    if (!updatedInstitution) {
      throw new NotFoundException(`L'institution d'id ${id} n'existe pas.`);
    }

    try {
      // Enregistrer l'entité mise à jour
      return await this.institutionRepository.save(updatedInstitution);
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la mise à jour de l'institution.", error.message);
    }
  }

  async softDeleteInstitution(
    user: UserEntity,
    institutionId: number,
  ): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à effectuer cette action.",
      );
    }
    // Soft-deleté l'institution
    const result = await this.institutionRepository.softDelete({
      id: institutionId,
    });

    // Vérifier si l'institution a été soft-deletée
    if (result.affected === 0) {
      throw new NotFoundException(
        `Impossible de trouver l'institution avec l'ID ${institutionId}.`,
      );
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `L'institution a été soft-deleted avec succès.`;

  }

  async restoreInstitution(user: UserEntity, institutionId: number): Promise<InstitutionEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Restaurer l'institution soft-deletée en utilisant son ID
    const result = await this.institutionRepository.restore({ id: institutionId });

    // Vérifier si l'institution a été restaurée
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'institution avec l'ID ${institutionId}.`);
    }

    // Récupérer l'institution restaurée
    const restoredInstitution = await this.getInstitutionById(institutionId);

    // Retourner l'institution restaurée
    return restoredInstitution;
}

async deleteInstitution(user: UserEntity, institutionId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Supprimer l'institution de la base de données
    const result = await this.institutionRepository.delete(institutionId);

    // Vérifier si l'institution a été supprimée
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'institution avec l'ID ${institutionId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `L'institution a été supprimée avec succès.`;
}


}