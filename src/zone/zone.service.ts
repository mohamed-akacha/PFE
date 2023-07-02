import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ZoneEntity } from './entities/zone.entity';

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(ZoneEntity)
    private readonly zoneRepository: Repository<ZoneEntity>,
    private readonly userService: UserService,
  ) { }

  async createZone(createZoneDto: CreateZoneDto, user: UserEntity): Promise<ZoneEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }
    try {
      const newZone = this.zoneRepository.create(createZoneDto);
      return this.zoneRepository.save(newZone);
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la création d'une Zone.", error.message);
    }
  }

  async getAllZones(): Promise<ZoneEntity[]> {
    try {
      const queryBuilder =  this.zoneRepository.createQueryBuilder('zone');
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException("Une erreur est survenue lors de la récupération des points d'évaluation.", error.message);
    }
  }

  async getZoneById(idZone: number): Promise<ZoneEntity> {
    const zone = await this.zoneRepository.findOne({ where: { id: idZone } });
    if (!zone) {
      throw new NotFoundException(`Impossible de trouver la zone avec l'ID ${idZone}.`);
    }
    return zone;
  }

  async updateZone(
    id: number,
    updateZoneDto: UpdateZoneDto,
    user: UserEntity
  ): Promise<Partial<ZoneEntity>> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }
    const updatedZone = await this.zoneRepository.preload({
      id,
      ...updateZoneDto,
    });
    if (!updatedZone) {
      throw new NotFoundException(`Zone with id ${id} n'existe pas.`);
    }
    return this.zoneRepository.save(updatedZone);
  }
  async softDeleteZone(user: UserEntity,zoneId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à effectuer cette action.",
      );
    }
    // Soft-deleté l'Zone
    const result = await this.zoneRepository.softDelete({
      id: zoneId,
    });

    // Vérifier si l'Zone a été soft-deletée
    if (result.affected === 0) {
      throw new NotFoundException(
        `Impossible de trouver l'Zone avec l'ID ${zoneId}.`,
      );
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return `L'Zone a été soft-deleted avec succès.`;

  }

  async restoreZone(user: UserEntity, zoneId: number): Promise<ZoneEntity> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Restaurer l'Zone soft-deletée en utilisant son ID
    const result = await this.zoneRepository.restore({ id: zoneId });

    // Vérifier si l'Zone a été restaurée
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'Zone avec l'ID ${zoneId}.`);
    }

    // Récupérer l'Zone restaurée
    const restoredZone = await this.getZoneById(zoneId);

    // Retourner l'Zone restaurée
    return restoredZone;
  }

  async deleteZone(user: UserEntity, id: number): Promise<{ message:string }> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.userService.isAdmin(user)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }
    // Supprimer zone de la base de données
    const result = await this.zoneRepository.delete(id);
    // Vérifier si zone a été supprimée
    if (result.affected === 0) {
      throw new NotFoundException(`Zone with id ${id} not found`);
    }

    // Envoyer une réponse pour indiquer que l'opération s'est déroulée avec succès
    return {message:`Zone a été supprimée avec succès.`};
  }
}
