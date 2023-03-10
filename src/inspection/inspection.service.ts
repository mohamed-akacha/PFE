import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from 'src/enums/user-role.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AddInspectionDto } from './dto/add-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionEntity } from './entites/inspection.entity';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(InspectionEntity)
    private inspectionRepository: Repository<InspectionEntity>,
    private userService: UserService,
  ) {}

  async createInspection(user: UserEntity, inspectionDto: AddInspectionDto) {
    const { description , datePrevue ,type  } = inspectionDto;

    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
        throw new UnauthorizedException("Seuls les administrateurs sont autorisés à créer des inspections");
      }
        let inspectionData ={
          description,
          datePrevue,
          type
        }
      let newInspection = this.inspectionRepository.create(inspectionData);
      newInspection.user=await this.userService.getUserById(inspectionDto.inspecteurId);

     let res = await this.inspectionRepository.save(newInspection);
     let {id,username}=res.user
     console.log("return::::::",res);
   return {
    id:res.id,
    description:res.description,
    datePrevue: res.datePrevue,
    type:res.type,
    statut:res.statut,
    user:{id,username}
   };

      








     /*  // Récupérer l'inspecteur correspondant à l'id fourni
       const inspecteur = await this.userService.getUserById(inspecteurId);

      if (!inspecteur) {
          throw new NotFoundException(`L'utilisateur avec l'ID ${inspecteurId} n'existe pas`);
          }
    // Créer une nouvelle inspection avec la description, la date prévue et le type
    const newInspection = this.inspectionRepository.create({
      description,
      datePrevue,
      type,
      user:inspecteur ? inspecteur : user
    });

    // Assigner l'utilisateur associé à l'inspection
  //  newInspection.user = inspecteur;

    // Sauvegarder la nouvelle inspection dans la base de données
    return await this.inspectionRepository.save(newInspection); */
  }

  async getAllInspections(user: UserEntity): Promise<InspectionEntity[]> {
    console.log("user +++++" , user)
    if (this.userService.isAdmin(user))
      return await this.inspectionRepository.find();
    return await this.inspectionRepository.find({where:{user:user}});

  }
  
  async getInspectionById(user: UserEntity, inspectionId: number): Promise<InspectionEntity> {
    // Récupérer l'inspection spécifique en utilisant son ID
    const inspection = await this.inspectionRepository.findOne({ where: { id: inspectionId } });
  
    // Vérifier si l'utilisateur est autorisé à voir l'inspection
    if (!this.canViewInspection(user, inspection)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à voir cette inspection.');
    }
  
    return inspection;
  }

  async updateInspection(user: UserEntity, inspectionId: number, updateInspectionDto: UpdateInspectionDto): Promise<InspectionEntity> {
    // Récupérer l'inspection spécifique en utilisant son ID
    const inspection = await this.getInspectionById(user, inspectionId);

    // Vérifier si l'utilisateur est autorisé à effectuer la mise à jour de l'inspection
    if (!this.canViewInspection(user, inspection)) {
        throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Vérifier si le champ inspecteurId est présent dans l'objet updateInspectionDto
    // Si oui, récupérer l'utilisateur correspondant à l'ID fourni
    let inspecteur;
    if (updateInspectionDto.inspecteurId) {
        inspecteur = await this.userService.getUserById(updateInspectionDto.inspecteurId);
        if (!inspecteur) {
            throw new NotFoundException(`L'utilisateur avec l'ID ${updateInspectionDto.inspecteurId} n'existe pas`);
        }
    }

    // Mettre à jour les champs de l'inspection avec les valeurs fournies dans l'objet updateInspectionDto
    inspection.description = updateInspectionDto.description ?? inspection.description;
    inspection.datePrevue = updateInspectionDto.datePrevue ?? inspection.datePrevue;
    inspection.type = updateInspectionDto.type ?? inspection.type;
    inspection.statut = updateInspectionDto.statut ?? inspection.statut;
    inspection.dateInspection = updateInspectionDto.dateInspection ?? inspection.dateInspection;

    // Si l'inspecteur a été récupéré, l'assigner à l'inspection
    if (inspecteur) {
        inspection.user = inspecteur;
    }

    // Sauvegarder les modifications dans la base de données
    return await this.inspectionRepository.save(inspection);
}
 
  
 
  async softDeleteInspection(user: UserEntity, inspectionId: number): Promise<void> {
   
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }
     // Récupérer l'inspection spécifique en utilisant son ID
     const inspection = await this.getInspectionById(user , inspectionId);
  
    if (!inspection) {
        throw new NotFoundException('Inspection introuvable.');
      }
    // Marquer l'inspection comme "supprimée" en la soft-deletant
    await this.inspectionRepository.softDelete({ id: inspectionId });
  }
  
  async restoreInspection(user: UserEntity, inspectionId: number): Promise<void> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }
  
    // Restaurer l'inspection supprimée en utilisant son ID
    await this.inspectionRepository.restore({ id: inspectionId });
  }

  async deleteInspection(user: UserEntity, inspectionId: number): Promise<void> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }
  
    // Récupérer l'inspection spécifique en utilisant son ID
    const inspection = await this.inspectionRepository.findOne({ where: { id: inspectionId } });
  
    // Vérifier si l'inspection existe
    if (!inspection) {
      throw new NotFoundException('Inspection introuvable.');
    }
  
    // Supprimer l'inspection de la base de données
    await this.inspectionRepository.remove(inspection);
  }
  


// Méthode privée pour vérifier si l'utilisateur est autorisé à voir l'inspection
private canViewInspection(user: UserEntity, inspection: InspectionEntity): boolean {
    return this.userService.isAdmin(user) || this.userService.isOwner(user, inspection);
  }

}