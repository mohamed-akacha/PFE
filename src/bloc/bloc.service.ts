import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateBlocDto } from './dto/create-bloc.dto';
import { UpdateBlocDto } from './dto/update-bloc.dto';
import { BlocEntity } from './entities/bloc.entity';

@Injectable()
export class BlocService {
  constructor(
    @InjectRepository(BlocEntity)
    private readonly blocRepository: Repository<BlocEntity>,
    private readonly userService: UserService,
  ) { }
  async createBloc(
    user: UserEntity,
    createBlocDto: CreateBlocDto,
  ): Promise<Partial<BlocEntity>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à créer des Blocs ");
    }
    try {
      const newBloc = this.blocRepository.create({
        ...createBlocDto,
        inspectionUnit:{id:createBlocDto.inspectionUnitId}
      });
      return await this.blocRepository.save(newBloc);
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException("L'unité d'inspection n'existe pas.");
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la création d'un bloc.", error.message);
      }
    }
    
  }

  async getAlltBlocs(): Promise<BlocEntity[]> {

    try {
      const queryBuilder =  this.blocRepository.createQueryBuilder('bloc');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la récupération des bloc.", error.message);
    }
  }


  async getOneById(id: number): Promise<BlocEntity> {
    const bloc = await this.blocRepository.createQueryBuilder('bloc')
      .where('bloc.id = :id', { id })
      .getOneOrFail();
    return bloc;
  }

  async getBlocsByIds(blocIds: number[]): Promise<BlocEntity[]> {
    const blocs = await this.blocRepository.createQueryBuilder('bloc')
      .where('bloc.id IN (:...blocIds)', { blocIds })
      .getMany();
    return blocs;
  }

  async updateBloc(
    idBloc: number,
    updateBlocDto: UpdateBlocDto,
    user: UserEntity,
  ): Promise<Partial<BlocEntity>> {
    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à modifier des blocs");
    }

    // Précharger les données de mise à jour dans l'entité existante
    const updatedBloc = await this.blocRepository.preload({
      id: idBloc,
      ...updateBlocDto,
      inspectionUnit: {id:updateBlocDto.inspectionUnitId}
      
    });
 
    if(! updatedBloc) {
      throw new NotFoundException(`Le bloc d'id ${idBloc} n'existe pas`);
    }
 
    try {
      // Enregistrer l'entité mise à jour
      return await this.blocRepository.save(updatedBloc);
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException("L'unité d'inspection n'existe pas.");
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la mise à jour du bloc.", error.message);
      }
    }
  }


  async getBlocksByUnit(unitId: number): Promise<BlocEntity[]> {
    return await this.blocRepository.find({
      where: {
        inspectionUnit: { id: unitId },
      },
    });
  }



  async softDeleteBloc(user: UserEntity, blocId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Soft-delete le bloc en utilisant son ID
    const result = await this.blocRepository.softDelete({ id: blocId });

    // Vérifier si le bloc a été soft-deleté
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le bloc avec l'ID ${blocId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `Le bloc a été soft-deleté avec succès.`;
  }

  async restoreBloc(user: UserEntity, blocId: number): Promise<BlocEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Restaurer le bloc soft-deleté en utilisant son ID
    const result = await this.blocRepository.restore({ id: blocId });

    // Vérifier si le bloc a été restauré
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le bloc avec l'ID ${blocId}.`);
    }

    // Récupérer le bloc restauré
    const restoredBloc = await this.getOneById(blocId);

    // Retourner le bloc restauré
    return restoredBloc;
  }

  async deleteBloc(user: UserEntity, blocId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Supprimer le bloc de la base de données
    const result = await this.blocRepository.delete(blocId);

    // Vérifier si le bloc a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver le bloc avec l'ID ${blocId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `Le bloc a été supprimé avec succès.`;
  }

}
