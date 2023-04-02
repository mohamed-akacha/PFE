import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, ClassSerializerInterceptor, UseGuards, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/decorators/user.decorator';
import { Contrat } from './entities/contrat.entity';
import { ContratService } from './contrat.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('contracts')
@Controller('contracts')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class ContratController {
  constructor(private readonly contratService: ContratService) {}

  @Post()
  @Roles('admin')
  async createContract(
    @User() user: UserEntity,
    @Body() createContractDto: CreateContratDto,
  ): Promise<Partial<Contrat>> {
    try{
    return await this.contratService.createContrat(user, createContractDto);
    }catch (error) {
      throw error;
    }
  }

  @Get()
  async getAllContracts(): Promise<Contrat[]> {
    try{
    return await this.contratService.getAllContrats();
    }catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getContractById(@Param('id') id: number): Promise<Contrat> {
    try{
    return await this.contratService.getContratById(id);
    }catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @Roles('admin')
  async updateContract(
    @User() user: UserEntity,
    @Param('id') id: number,
    @Body() updateContractDto: UpdateContratDto,
  ): Promise<Partial<Contrat>> {
    try{
    return await this.contratService.updateContract(id, updateContractDto, user);
    }
    catch (error) {
      throw error;
    }
  }

  @Patch('/:id')
  @Roles('admin')
  async softDeleteContrat(
    @User() user: UserEntity,
    @Param('id') contratId: number,
  ): Promise<string> {
    try {
      return await this.contratService.softDeleteContrat(user, contratId);
    } catch (error) {
      throw error;
    }
  }

  @Patch('restore/:id')
  @Roles('admin')
  async restoreContrat(
    @User() user: UserEntity,
    @Param('id') contratId: number,
  ): Promise<Contrat> {
    try {
      return await this.contratService.restoreContrat(user, contratId);
    } catch (error) {
      throw error;
    
    }
  }

  @Delete('force/:id')
  @Roles('admin')
  async deleteContrat(
    @User() user: UserEntity,
    @Param('id') contratId: number,
  ): Promise<string> {
    try {
      return await this.contratService.deleteContrat(user, contratId);
    } catch (error) {
      throw error;
    }
  }
}