import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EntityNotFoundError, Repository, TypeORMError } from 'typeorm';
import { Contrat } from './entities/contrat.entity';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';


@Injectable()
export class ContratService {
  constructor(
    @InjectRepository(Contrat)
    private readonly contratRepository: Repository<Contrat>,
    private readonly userService: UserService,
  ) { }

  async createContrat(
    user: UserEntity,
    createContratDto: CreateContratDto,
  ): Promise<Partial<Contrat>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à créer des contrats.");
    }

    const { date_debut, duree } = createContratDto;
    try {
      const newContract = this.contratRepository.create({
        date_debut,
        duree,
        institution: { id: createContratDto.institutionId },
        sousTraitant: { id: createContratDto.sousTraitantId }
      });

      return await this.contratRepository.save(newContract);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException("Les données du contrat sont invalides.");
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la création d'un contrat.", error.message);
      }
    }
  }


  async getAllContrats(): Promise<Contrat[]> {
    try {
      const queryBuilder = this.contratRepository.createQueryBuilder('contrats');
      return await queryBuilder.getMany();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException("Les données du contrat sont invalides.");}
      else if (error instanceof TypeORMError) {
        throw new BadRequestException("Les données des contrats sont invalides.");
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la récupération des contrats.", error.message);
      }
    }
  }


  async getContratById(id: number): Promise<Contrat> {
    try {
      const contrat = await this.contratRepository.createQueryBuilder('contrat')
        .where('contrat.id = :id', { id })
        .getOneOrFail();

      return contrat;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Le contrat d'identifiant ${id} n'existe pas.`);
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la récupération du contrat.", error.message);
      }
    }
  }


  async updateContract(
    id: number,
    updateContratDto: UpdateContratDto,
    user: UserEntity,
  ): Promise<Partial<Contrat>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à modifier des contrats.");
    }
    const { date_debut, duree } = updateContratDto;

    try {   
      const updatedContract = await this.contratRepository.preload({
        id,
        date_debut,
        duree,
        institution:{id:updateContratDto.institutionId},
        sousTraitant:{id:updateContratDto.sousTraitantId},
      });
      if(! updatedContract) {
        throw new NotFoundException(`Le contrat d'id ${id} n'existe pas`);
      }
      return await this.contratRepository.save(updatedContract);
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException("Le contrat n'existe pas.");
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException("Les données du contrat sont invalides.");
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException("Les données du contrat sont invalides.");
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la mise à jour du contrat.", error.message);
      }
    }
    
 
  }

  async softDeleteContrat(user: UserEntity, contratId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Soft-delete le contrat en utilisant son ID
    const result = await this.contratRepository.softDelete({ id: contratId });

    // Vérifier si le contrat a été soft-deleté
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le contrat avec l'ID ${contratId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `Le contrat a été soft-deleté avec succès.`;
  }

  async restoreContrat(user: UserEntity, contratId: number): Promise<Contrat> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Restaurer le contrat soft-deleté en utilisant son ID
    const result = await this.contratRepository.restore({ id: contratId });

    // Vérifier si le contrat a été restauré
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le contrat avec l'ID ${contratId}.`);
    }

    // Récupérer le contrat restauré
    const restoredContrat = await this.getContratById(contratId);

    // Retourner le contrat restauré
    return restoredContrat;
  }

  async deleteContrat(user: UserEntity, contratId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Supprimer le contrat de la base de données
    const result = await this.contratRepository.delete(contratId);

    // Vérifier si le contrat a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le contrat avec l'ID ${contratId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `Le contrat a été supprimé avec succès.`;
  }

  
}
