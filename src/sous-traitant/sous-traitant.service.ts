import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateSousTraitantDto } from './dto/create-sous-traitant.dto';
import { UpdateSousTraitantDto } from './dto/update-sous-traitant.dto';
import { SousTraitantEntity } from './entities/sous-traitant.entity';

@Injectable()
export class SousTraitantService {
  constructor(
    @InjectRepository(SousTraitantEntity)
    private readonly sousTraitantRepository: Repository<SousTraitantEntity>,
    private readonly userService: UserService,
  ) { }

  async createSousTraitant(
    user: UserEntity,
    createSousTraitantDto: CreateSousTraitantDto,
  ): Promise<Partial<SousTraitantEntity>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à créer des sous-traitants");
    }

    try {
      const newSousTraitant = this.sousTraitantRepository.create(createSousTraitantDto);
      return await this.sousTraitantRepository.save(newSousTraitant);
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la création d'un sous-traitant.", error.message);
    }
  }

  async getAllSousTraitants(): Promise<SousTraitantEntity[]> {
    try {
      const queryBuilder = this.sousTraitantRepository.createQueryBuilder('sous-traitant');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la récupération des sous-traitants.", error.message);
    }
  }

  async getSousTraitantById(id: number): Promise<SousTraitantEntity> {
    const sousTraitant = await this.sousTraitantRepository.createQueryBuilder('sous-traitant')
      .where('sous-traitant.id = :id', { id })
      .getOneOrFail();
    return sousTraitant;
  }

  async updateSousTraitant(
    idSousTraitant: number,
    updateSousTraitantDto: UpdateSousTraitantDto,
    user: UserEntity,
  ): Promise<Partial<SousTraitantEntity>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à modifier des sous-traitants");
    }
  
    // Vérifier que le sous-traitant existe
    const sousTraitant = await this.sousTraitantRepository.preload({
      id: idSousTraitant,
      ...updateSousTraitantDto,
    });
  
    if (!sousTraitant) {
      throw new NotFoundException(`Le sous-traitant d'id ${idSousTraitant} n'existe pas`);
    }
  
    try {
      // Enregistrer l'entité mise à jour
      return await this.sousTraitantRepository.save(sousTraitant);
    } catch (error)  {
      throw new InternalServerErrorException("Une erreur est survenue lors de la mise à jour du sous-traitant.", error.message);
    }
  }

  async softDeleteSousTraitant(user: UserEntity, sousTraitantId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Soft-delete le sous-traitant en utilisant son ID
    const result = await this.sousTraitantRepository.softDelete({ id: sousTraitantId });

    // Vérifier si le sous-traitant a été soft-deleté
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le sous-traitant avec l'ID ${sousTraitantId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `Le sous-traitant a été soft-deleté avec succès.`;
  }

  async restoreSousTraitant(user: UserEntity, sousTraitantId: number): Promise<SousTraitantEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Restaurer le sous-traitant soft-deleté en utilisant son ID
    const result = await this.sousTraitantRepository.restore({ id: sousTraitantId });

    // Vérifier si le sous-traitant a été restauré
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le sous-traitant avec l'ID ${sousTraitantId}.`);
    }

    // Récupérer le sous-traitant restauré
    const restoredsousTraitant = await this.getSousTraitantById(sousTraitantId)

    // Retourner le sous-traitant restauré
    return restoredsousTraitant;
  }

  async deleteSousTraitant(user: UserEntity, sousTraitantId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Supprimer le sous-traitant de la base de données
    const result = await this.sousTraitantRepository.delete(sousTraitantId);

    // Vérifier si le sous-traitant a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le sous-traitant avec l'ID ${sousTraitantId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `Le sous-traitant a été supprimé avec succès.`;
  }
  

}