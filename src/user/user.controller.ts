import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserService } from './user.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/rôles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private userService: UserService
  ) {
  }
  @Post('register')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createUser(
    @User() userReq: UserEntity,
    @Body() userData: UserSubscribeDto
  ) {
    try {
      return await this.userService.createUser(userReq, userData);
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la création de l\'utilisateur.', error.message);
    }
  }


  @Post('login')
  async login(
    @Body() credentials: LoginCredentialsDto
  ) {
    try {
      return await this.userService.login(credentials);
    } catch (error) {
      throw new HttpException('Email ou mot de passe incorrect.', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('all')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(@User() userReq: UserEntity): Promise<UserEntity[]> {
    try {
      return await this.userService.findAll(userReq);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Une erreur est survenue lors de la récupération des utilisateurs.',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
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


  @Patch('restore/:id')
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

  @Delete('force/:id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteUser(
    @User() userReq: UserEntity,
    @Param('id', ParseIntPipe) userId: number
  ): Promise<string> {
    try {
    return  await this.userService.deleteUser(userReq, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  }



}
