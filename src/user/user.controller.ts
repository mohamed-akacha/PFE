import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Put, Query, Render, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserService } from './user.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/rôles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@ApiTags("Users")
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private userService: UserService
  ) {}
  
  //afficher tous les utilisateurs
  @Get(':role/:sd')
  @ApiOperation({ summary: 'Liste de tous les utilisateur, saufs les soft deleted' })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(@User() userReq: UserEntity,@Param('role') role: string,@Param('sd') sd: string,): Promise<UserEntity[]> {
    try {
      return await this.userService.findAll(userReq,role,sd);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Une erreur est survenue lors de la récupération des utilisateurs.'+error,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //afficher tous les utilisateurs
  @Get(':id')
  @ApiOperation({ summary: 'Trouver un utilisateur par son ID' })
  @Roles('admin','user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findById(@Param('id', ParseIntPipe) userId: number): Promise<UserEntity> {
    try {
      return await this.userService.getUserById(userId);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Une erreur est survenue lors de la récupération de l'utilisateur.",
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //modification
  @Put(':id')
  @ApiOperation({ summary: 'Modifier un utilisateur' })
  @Roles('admin', 'user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateUser(@User() userReq: UserEntity,@Body() userData: UpdateUserDto,
    @Param('id', ParseIntPipe) userId: number){
    try {
      return await this.userService.updateUser(userId, userData, userReq);
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Erreur lors de la modification de l\'utilisateur.', error.message);
    }
  }
  //désactivation d'un utilisateur(soft delete)
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('softdelete/:id')
  @ApiOperation({ summary: 'Désactiver un utilisateur, (soft delete)' })
  async softDeleteUser(@User() userReq: UserEntity,
    @Param('id', ParseIntPipe) userId: number): Promise<string> {
    try {
      return await this.userService.softDeleteUser(userReq, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException("Une erreur est survenue lors de la suppression de l'utilisateur.");
      }
    }
  }
  //récupération d'un utilisateur désactivé (soft delete)
  @Patch('restore/:id')
  @ApiOperation({ summary: 'Activer un utilisateur' })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async restoreUser(@User() userReq: UserEntity, @Param('id', ParseIntPipe) userId: number): Promise<UserEntity> {
    try {
      return await this.userService.restoreUser(userReq, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la restauration de l\'utilisateur.');
    }
  }

  //suppression définitive d'un utilisateur
  @Delete(':id')
  @ApiOperation({ summary: 'Suppression définitive d\'un utilisateur' })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteUser(
    @User() userReq: UserEntity,
    @Param('id', ParseIntPipe) userId: number
  ): Promise<string> {
    try {
      return await this.userService.deleteUser(userReq, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  }



}
