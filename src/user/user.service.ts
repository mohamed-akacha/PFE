import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {
  }
  async register(userData: UserSubscribeDto): Promise<Partial<UserEntity>> {
    const user = this.userRepository.create({
      ...userData
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.userRepository.save(user);
      return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
      };
      } catch (e) {
      if (e.code === '23505') {
      // Le username ou l'email existe déjà
      throw new ConflictException('Le username et le email doivent être unique');
      }
      throw new InternalServerErrorException();
      }

  }

  async login(credentials: LoginCredentialsDto)  {

    // Récupére le login et le mot de passe
     const {username, password} = credentials;
    // On peut se logger ou via le username ou le password
    // Vérifier est ce qu'il y a un user avec ce login ou ce mdp
    const user = await this.userRepository.createQueryBuilder("user")
      .where("user.username = :username or user.email = :username",
        {username}
        )
      .getOne();
    // console.log(user);
    // Si not user je déclenche une erreur
    if (!user)
      throw new NotFoundException('Nom d\'utilisateur ou mot de passe incorrect.');
    // Si oui je vérifie est ce que le mot est correct ou pas
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword === user.password) {
      const payload = {
        username: user.username,
        email: user.email,
        role: user.role
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        "access_token" : jwt
      };
    } else {
      // Si mot de passe incorrect je déclenche une erreur
      throw new NotFoundException('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  }

 /*  isOwnerOrAdmin(objet, user) {
    return user.role === UserRoleEnum.ADMIN || (objet.user && objet.user.id === user.id);
  } */

  async findAll(options = null): Promise<UserEntity[]> {
    if (options) {
      return await this.userRepository.find(options);
    }
    return await this.userRepository.find();
  }

  async getUserById(idUser?: number){
   //console.log('idUser--------------',idUser);
    
      let [h]=await this.userRepository.query("select * from user where id = ?" , [idUser]);
  
       return h!==undefined?h:null;
    
  }

  // Méthode privée pour vérifier si l'utilisateur est un administrateur
 isAdmin(user: UserEntity): boolean {
  return user.role === UserRoleEnum.ADMIN;
}

// Méthode privée pour vérifier si l'utilisateur est bien le propriétaire de l'inspection
 isOwner(user: UserEntity, objet): boolean {
  return user.id === objet.user.id;
}
}


