import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { InstitutionEntity } from './entities/institution.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@ApiTags('institutions')
@ApiBearerAuth()
@Controller('institutions')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  @Roles('admin')
  async createInstitution(
    @User() user: UserEntity,
    @Body() createInstitutionDto: CreateInstitutionDto,
  ): Promise<InstitutionEntity> {
    try {
      return await this.institutionService.createInstitution(user, createInstitutionDto);
      
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('admin', 'user')
  async getAllInstitutions(): Promise<InstitutionEntity[]> {
    try {
      return  await this.institutionService.getAllInstitutions();
  
    } catch (error) {
      throw error;
    }
  }
  @Get("A")
  @Roles('admin', 'user')
  async getAllInstitutionsA(): Promise<any> {
    try {
      return  await this.institutionService.getAllInstitutionsA();

    } catch (error) {
      throw error;
    }
  }




  @Get("/byzone/:id")
  @Roles('admin', 'user')
  async getAllInstitutionsByZone(@Param('id', ParseIntPipe) id: number): Promise<InstitutionEntity[]> {
    try {
      return  await this.institutionService.getAllInstitutionsByZone(id);

    } catch (error) {
      throw error;
    }
  }
  @Get("/byzone/A/:id")
  @Roles('admin', 'user')
  async getAllInstitutionsByZoneA(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return  await this.institutionService.getAllInstitutionsByZoneA(id);

    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getInstitutionById(@Param('id', ParseIntPipe) id: number): Promise<InstitutionEntity> {
    try {
      const institution = await this.institutionService.getInstitutionById(id);
      if (!institution) {
        throw new NotFoundException(`Impossible de trouver l'institution avec l'ID ${id}.`);
      }
      return institution;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  @Patch(':id')
  @Roles('admin')
  async updateInstitution(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @Body() updateInstitutionDto: UpdateInstitutionDto,
  ): Promise<Partial<InstitutionEntity>> {
    try {
      return await this.institutionService.updateInstitution(id, updateInstitutionDto, user);

    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles('admin')
  async softDeleteInstitution(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<string> {
    try {
      return await this.institutionService.softDeleteInstitution(user, id);
    } catch (error) {
      throw error;
    }
  }

  @Patch('restore/:id')
  @Roles('admin')
  async restoreInstitution(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<InstitutionEntity> {
    try {
      return await this.institutionService.restoreInstitution(user, id);

    } catch (error) {
      throw error;
    }
  }

  @Delete('force/:id')
  @Roles('admin')
  async deleteInstitution(@Param('id', ParseIntPipe) id: number,@User() user: UserEntity): Promise<{ message:string }> {
    try {
      return await this.institutionService.deleteInstitution(user,id);

    } catch (error) {
      throw error;
    }
  }
}
