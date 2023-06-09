import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Not, Repository, SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { isAdmin, isOwner } from './shared.utils'

@Injectable()
export class UserService {
  //constructor
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}
  
    //create first admin account
  async seedUser(userData: UserSubscribeDto): Promise<Partial<UserEntity>> {

    const user = this.userRepository.create({
      ...userData
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      console.log(e.message);
      if (e.errno === 1062) {
        throw new ConflictException('Le username et le email doivent être unique');
      }
      throw new InternalServerErrorException();
    }

  }
  //calculate the number of users
  async usersCount(): Promise<Number> {
    try {
      return await this.userRepository.count();
    } 
    catch (error) {
      throw new InternalServerErrorException(`Une erreur est survenue lors de la récupération des utilisateurs: ${error}`);
    }
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto, userReq: UserEntity | undefined): Promise<Partial<UserEntity>> {
    if (!this.isAdmin(userReq)) {
        throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }
    if (userReq && this.isAdmin(userReq) && updateUserDto.role) {
      user.role = updateUserDto.role;
    }
    //changement password
    if(updateUserDto.oldpassword) {
      const hashedPassword = await bcrypt.hash(updateUserDto.oldpassword, user.salt);
      if (hashedPassword === user.password) {
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(updateUserDto.password, user.salt);
        return await this.userRepository.save(user);
      }
      else {
        throw new ConflictException('vous avez fourni un ancien mot de passe erroné');
      }
    }
    user.username = updateUserDto.username ?? user.username;
    user.email = updateUserDto.email ?? user.email;
    user.tel = updateUserDto.tel ?? user.tel;
    if (updateUserDto.password) {
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.password, user.salt);
    }
    try {
      return await this.userRepository.save(user);
    } 
    catch (e) {
      if (e.errno === 1062) {
        throw new ConflictException('Le username et le email doivent être unique');
      }
      throw new InternalServerErrorException();
    }
  }
 
  async findAll(userReq: UserEntity, role:any ,sd:any): Promise<UserEntity[]> {
    try {
      if (!this.isAdmin(userReq)) {
        throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
      }
      const queryBuilder: SelectQueryBuilder<UserEntity> = this.userRepository.createQueryBuilder('user');

      // Apply role filter
      if (role!=="all") {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      // Apply soft-deleted filter
      if (sd === 'all') {
        queryBuilder.withDeleted();
      } 
      return await queryBuilder.getMany();
   
    
    } catch (error) {
      throw new InternalServerErrorException(`Une erreur est survenue lors de la récupération des utilisateurs: ${error}`);
    }
  }

  async getUserById(idUser?: number): Promise<UserEntity | null> {

    const user = await this.userRepository.createQueryBuilder('user')
    .withDeleted()
      .where({ id: idUser })
      .getOne();


    return user ;
  }
  async softDeleteUser(userReq: UserEntity, userId: number): Promise<UserEntity> {

    try {

      if (!this.isAdmin(userReq)) {
        throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
      }
      const result = await this.userRepository.softDelete({ id: userId });
      if (result.affected === 0) {
        throw new NotFoundException(`Impossible de trouver l'utilisateur avec l'ID ${userId}.`);
      }
      const deletedUser = await this.userRepository.findOne({where:{id:userId}, withDeleted: true });
      if (!deletedUser) {
        throw new NotFoundException(`Impossible de trouver l'utilisateur avec l'ID ${userId}.`);
      }

      return deletedUser;
    } catch (error) {
      console.log(error.message)
      throw new InternalServerErrorException("Une erreur est survenue lors de la suppression de l'utilisateur.");
    }
  }
  async restoreUser(userReq: UserEntity, userId: number): Promise<UserEntity> {
    if (!this.isAdmin(userReq)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    const result = await this.userRepository.restore({ id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de restaurer l'utilisateur avec l'ID ${userId}.`);
    }

    const restoredUser = await this.getUserById(userId);
    if (!restoredUser) {
      throw new NotFoundException(`Impossible de trouver l'utilisateur restauré avec l'ID ${userId}.`);
    }

    return restoredUser;
  }
  async deleteUser(userReq: UserEntity, userId: number): Promise<string> {
    // Vérifier si l'utilisateur est autorisé à effectuer cette action
    if (!this.isAdmin(userReq)) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à effectuer cette action.");
    }

    // Supprimer l'utilisateur en utilisant son ID
    const result = await this.userRepository.delete(userId);

    // Vérifier si l'utilisateur a été supprimé
    if (result.affected === 0) {
      throw new NotFoundException(`Impossible de trouver l'utilisateur avec l'ID ${userId}.`);
    }
    return `L'utilisateur a été supprimée définitivement avec succès.`;
  }

 
  isAdmin(user: UserEntity): boolean {
    return isAdmin(user);
  }
  isOwner(user: UserEntity, objet): boolean {
    return isOwner(user, objet);
  }
}


