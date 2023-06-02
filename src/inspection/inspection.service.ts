import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InspectionUnitEntity } from 'src/inspection-unit/entities/inspection-unit.entity';
import { InspectionUnitService } from 'src/inspection-unit/inspection-unit.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AddInspectionDto } from './dto/add-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionEntity } from './entites/inspection.entity';
import { NotificationService } from 'src/notification/notification.service';
import { format } from 'date-fns'

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(InspectionEntity)
    private inspectionRepository: Repository<InspectionEntity>,
    private userService: UserService,
    private inspectionUnitService: InspectionUnitService,
    private notificationService: NotificationService
  ) { }


  async createInspection(user: UserEntity, inspectionDto: AddInspectionDto): Promise<Partial<InspectionEntity>> {
    const { description, datePrevue, type, inspecteurId, unitId } = inspectionDto;

    // Vérifier que l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Seuls les administrateurs sont autorisés à créer des inspections");
    }

    // Définir l'objet utilisateur à null ou au bon utilisateur
    let inspecteur: Partial<UserEntity> = null;
    if (inspecteurId) {
      inspecteur = await this.userService.getUserById(inspecteurId);
      if (!inspecteur) {
        throw new NotFoundException(`L'utilisateur avec l'ID ${inspecteurId} n'existe pas`);
      }
    }

    // Définir l'objet unité d'inspection à null ou à la bonne unité
    let unit: Partial<InspectionUnitEntity> = null;
    if (unitId) {
      unit = await this.inspectionUnitService.getUnitById(unitId);
      if (!unit) {
        throw new NotFoundException(`L'unité d'inspection avec l'ID ${unitId} n'existe pas`);
      }
    }

    // Créer une nouvelle inspection avec la description, la date prévue, le type et l'utilisateur
    const inspection = await this.inspectionRepository.save({
      description,
      datePrevue,
      type,
      user: inspecteur ? inspecteur : null,
      unit: unit ? unit : null
    });

    // Send notification to the inspector
    if (inspecteur) {
      const formattedDate = format(datePrevue, 'dd-MM-yyyy');
      const title = "New inspection assigned to you";
      const body = `New inspection assigned to you on ${formattedDate}`;
    
      await this.notificationService.sendToUser(inspecteur.id, title, body, inspection.id);
    }

    return inspection;
  }






  async getAllInspections(userReq: UserEntity): Promise<InspectionEntity[]> {
    const queryBuilder = this.inspectionRepository.createQueryBuilder("inspection");
    queryBuilder.leftJoinAndSelect("inspection.user", "user")
      .leftJoinAndSelect("inspection.unit", "unit")
      .leftJoinAndSelect('unit.institution', 'institution');

    if (!this.userService.isAdmin(userReq)) {
      queryBuilder.where("user.id = :userId", { userId: userReq.id });
    }

    return await queryBuilder.getMany();
  }


  async getInspectionById(userReq: UserEntity, inspectionId: number): Promise<InspectionEntity> {
    // Récupérer l'inspection spécifique en utilisant son ID avec les informations de l'utilisateur
    const inspection = await this.inspectionRepository.createQueryBuilder("inspection")
      .leftJoinAndSelect("inspection.user", "user")
      .leftJoinAndSelect("inspection.unit", "unit")
      .leftJoinAndSelect('unit.institution', 'institution')
      .where("inspection.id = :inspectionId", { inspectionId })
      .getOne();

    if (!inspection) {
      throw new NotFoundException(`L'inspection avec l'ID ${inspectionId} n'existe pas`);
    }
    // console.log(inspection);
    // Vérifier si l'utilisateur est autorisé à voir l'inspection
    if (!this.canViewInspection(userReq, inspection)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à voir cette inspection.');
    }

    return inspection;
  }


  async updateInspectionByAdmin(user: UserEntity, id: number, updateInspectionDto: UpdateInspectionDto): Promise<InspectionEntity> {
    // Vérifier si l'utilisateur est un administrateur
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Récupérer l'inspection spécifique en utilisant son ID
    let inspection = await this.getInspectionById(user, id);

    // Mettre à jour les champs de l'inspection avec les valeurs fournies dans l'objet updateInspectionDto
    inspection = this.inspectionRepository.merge(inspection, updateInspectionDto);

    // Si le champ inspecteurId est présent dans l'objet updateInspectionDto, récupérer l'utilisateur correspondant à l'ID fourni
    // let userObject: Partial<UserEntity> = null;
    if (updateInspectionDto.inspecteurId) {
      const inspecteur = await this.userService.getUserById(updateInspectionDto.inspecteurId);
      //   console.log(inspecteur)
      if (!inspecteur) {
        throw new NotFoundException(`L'utilisateur avec l'ID ${updateInspectionDto.inspecteurId} n'existe pas`);
      }

      // Assigner l'inspecteur à l'inspection
      inspection.user = inspecteur;
      // Envoyer une notification à l'inspecteur pour l'informer de la mise à jour de l'inspection
      const formattedDate = format(inspection.datePrevue, 'dd-MM-yyyy');
      const title = 'Inspection updated';
      const body = `An inspection assigned to you has been updated on ${formattedDate}`;
  
      await this.notificationService.sendToUser(inspecteur.id, title, body,inspection.id);
    }

    // Si le champ unitId est présent dans l'objet updateInspectionDto, récupérer l'unité correspondante à l'ID fourni
    if (updateInspectionDto.unitId) {
      const unite = await this.inspectionUnitService.getUnitById(updateInspectionDto.unitId);

      if (!unite) {
        throw new NotFoundException(`L'unité avec l'ID ${updateInspectionDto.unitId} n'existe pas`);
      }

      // Assigner l'unité à l'inspection
      inspection.unit = unite;
    }

    // Sauvegarder les modifications dans la base de données
    return await this.inspectionRepository.save(inspection);
  }

  async evaluateInspection(user: UserEntity, id: number): Promise<InspectionEntity> {
    // Récupérer l'inspection spécifique en utilisant son ID avec les informations de l'utilisateur
    const inspection = await this.getInspectionById(user, id);

    // Vérifier si l'utilisateur est autorisé à évaluer l'inspection
    if (!this.userService.isOwner(user, inspection)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à évaluer cette inspection.");
    }

    // Vérifier si l'inspection est affectée à une unité d'inspection
    if (!inspection.unit) {
      throw new BadRequestException("Cette inspection n'est pas affectée à une unité d'inspection.");
    }

    // Vérifier si l'inspection n'a pas encore été évaluée et si la date prévue est dépassée
    const now = new Date();
    if (inspection.statut || inspection.datePrevue > now) {
      throw new BadRequestException("Cette inspection a déjà été évaluée ou la date prévue n'est pas encore dépassée.");
    }

    // Mettre à jour le statut et la date d'inspection de l'inspection
    inspection.statut = true;
    inspection.dateInspection = now;

    return await this.inspectionRepository.save(inspection);
  }





  async softDeleteInspection(user: UserEntity, inspectionId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }
    /*  // Récupérer l'inspection spécifique en utilisant son ID
     const inspection = await this.getInspectionById(user, inspectionId);
     if (!inspection) {
       throw new NotFoundException('Inspection introuvable.');
     } */
    // Marquer l'inspection comme "supprimée" en la soft-deletant
    const result = await this.inspectionRepository.softDelete({ id: inspectionId });
    // Vérifier si l'inspection a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'inspection avec l'ID ${inspectionId}.`);
    }
    // Envoyer une réponse  pour indiquer que l'opération s'est déroulée avec succès
    return `L'inspection a été supprimée avec succès.`;
  }

  async restoreInspection(user: UserEntity, inspectionId: number): Promise<InspectionEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }
    // Restaurer l'inspection supprimée en utilisant son ID
    const result = await this.inspectionRepository.restore({ id: inspectionId });

    // Vérifier si l'inspection a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'inspection avec l'ID ${inspectionId}.`);
    }
    // Récupérer l'inspection restaurée
    const restoredInspection = await this.getInspectionById(user, inspectionId);
    // Retourner l'inspection restaurée
    return restoredInspection;
  }


  async deleteInspection(user: UserEntity, inspectionId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException('Vous n\'êtes pas autorisé à effectuer cette action.');
    }

    // Supprimer l'inspection de la base de données
    const result = await this.inspectionRepository.delete(inspectionId);

    // Vérifier si l'utilisateur a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'inspection avec l'ID ${inspectionId}.`);
    }
    // Envoyer une réponse  pour indiquer que l'opération s'est déroulée avec succès
    return `L'inspection a été supprimée avec succès.`;
  }


  // Méthode privée pour vérifier si l'utilisateur est autorisé à voir l'inspection
  private canViewInspection(user: UserEntity, inspection: InspectionEntity): boolean {
    return this.userService.isAdmin(user) || this.userService.isOwner(user, inspection);
  }


}