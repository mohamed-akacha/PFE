import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateInspectionUnitDto } from './dto/create-inspection-unit.dto';
import { UpdateInspectionUnitDto } from './dto/update-inspection-unit.dto';
import { InspectionUnitEntity } from './entities/inspection-unit.entity';

@Injectable()
export class InspectionUnitService {
  constructor(
    @InjectRepository(InspectionUnitEntity)
    private readonly inspectionUnitRepository: Repository<InspectionUnitEntity>,
    private readonly userService: UserService,
  ) { }


  async createInspectionUnit(user: UserEntity,createInspectionUnitDto: CreateInspectionUnitDto,): Promise<InspectionUnitEntity> {
    try {
      const inspectionUnit = this.inspectionUnitRepository.create({
        ...createInspectionUnitDto,
        institution: { id: createInspectionUnitDto.institutionId }

      });
      return this.inspectionUnitRepository.save(inspectionUnit);
    }
    catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException("L'unité d'inspection n'existe pas.");
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la création d'un unité d'inspection.", error.message);
      }
    }
  }

  async getAllInspectionUnits(): Promise<InspectionUnitEntity[]> {
    try {
      const queryBuilder =  this.inspectionUnitRepository.createQueryBuilder('unit-inspection');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la récupération des unités d'inspection .", error.message);
    }

  }

  async getUnitById(id?: number): Promise<InspectionUnitEntity | null> {
    const unit = await this.inspectionUnitRepository
      .createQueryBuilder('unit')
      .where('unit.id = :id', { id })
      .getOne();
    return unit || null;
  }

  async getUnitsByInstitution(id:number):Promise<any>{
    const units = await this.inspectionUnitRepository
        .createQueryBuilder('unit')
        .leftJoinAndSelect("unit.blocs","blocs")
        .where('unit.institution.id= :id',{id})
        .getMany();

    const data = units.map(unit => ({
      id:unit.id,
      nom: unit.nom,
      code: unit.code,
      numberOfBlocs: unit.blocs ? unit.blocs.length : 0
    }));
    return data;
  }

  async updateInspectionUnit(idUnit: number,updateInspectionUnitDto: UpdateInspectionUnitDto, user: UserEntity,): Promise<Partial<InspectionUnitEntity>> {
     // Vérifier que l'utilisateur est un administrateur
     if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à modifier des unités d'inspection");
    }
    const updatedUnit = await this.inspectionUnitRepository.preload({
      id: idUnit,
      ...updateInspectionUnitDto,
      institution: {id:updateInspectionUnitDto.institutionId}
      
    });
 
    if(! updatedUnit) {
      throw new NotFoundException(`L'unité d'inspection d'id ${idUnit} n'existe pas`);
    }
 
    try {
      // Enregistrer l'entité mise à jour
      return await this.inspectionUnitRepository.save(updatedUnit);
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException("L'unité d'inspection n'existe pas.");
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la mise à jour du L'unité d'inspection.", error.message);
      }
    }
  }

  async softDeleteInspectionUnit(user: UserEntity, inspectionUnitId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }
  
    // Soft-deleté l'unité d'inspection
    const result = await this.inspectionUnitRepository.softDelete({ id: inspectionUnitId });
  
    // Vérifier si l'unité d'inspection a été soft-deleté
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'unité d'inspection avec l'ID ${inspectionUnitId}.`);
    }
  
    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `L'unité d'inspection a été soft-deleted avec succès.`;
  }

  async restoreInspectionUnit(user: UserEntity, inspectionUnitId: number): Promise<InspectionUnitEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Restaurer l'unité d'inspection soft-deletée en utilisant son ID
    const result = await this.inspectionUnitRepository.restore({ id: inspectionUnitId });

    // Vérifier si l'unité d'inspection a été restaurée
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'unité d'inspection avec l'ID ${inspectionUnitId}.`);
    }

    // Récupérer l'unité d'inspection restaurée
    const restoredInspectionUnit = await this.getUnitById(inspectionUnitId);

    // Retourner l'unité d'inspection restaurée
    return restoredInspectionUnit;
}

  async deleteInspectionUnit(user: UserEntity, inspectionUnitId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Supprimer l'unité d'inspection de la base de données
    const result = await this.inspectionUnitRepository.delete(inspectionUnitId);

    // Vérifier si l'unité d'inspection a été supprimée
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'unité d'inspection avec l'ID ${inspectionUnitId}.`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `L'unité d'inspection a été supprimée avec succès.`;
}

}
