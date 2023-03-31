import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { CreateInspectionUnitDto } from './dto/create-inspection-unit.dto';
import { UpdateInspectionUnitDto } from './dto/update-inspection-unit.dto';
import { InspectionUnitEntity } from './entities/inspection-unit.entity';
import { InspectionUnitService } from './inspection-unit.service';

@ApiTags('inspection-unit')
@Controller('inspection-units')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class InspectionUnitController {
  constructor(private readonly inspectionUnitService: InspectionUnitService) { }

  @Post()
  @Roles('admin')
  async createInspectionUnit(
    @User() user: UserEntity,
    @Body() createInspectionUnitDto: CreateInspectionUnitDto,
  ): Promise<InspectionUnitEntity> {
    try {
      const inspectionUnit = await this.inspectionUnitService.createInspectionUnit(user, createInspectionUnitDto);
      return inspectionUnit;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('admin', 'user')
  async getAllInspectionUnits(): Promise<InspectionUnitEntity[]> {
    try {
      const inspectionUnits = await this.inspectionUnitService.getAllInspectionUnits();
      return inspectionUnits;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getInspectionUnitById(@Param('id', ParseIntPipe) id: number): Promise<InspectionUnitEntity> {
    try {
      const inspectionUnit = await this.inspectionUnitService.getUnitById(id);
      if (!inspectionUnit) {
        throw new Error(`Inspection unit with ID ${id} not found`);
      }
      return inspectionUnit;
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @Roles('admin')
  async updateInspectionUnit(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @Body() updateInspectionUnitDto: UpdateInspectionUnitDto,
  ): Promise<Partial<InspectionUnitEntity>> {
    try {
      return await this.inspectionUnitService.updateInspectionUnit(id, updateInspectionUnitDto, user);

    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles('admin')
  async softDeleteInspectionUnit(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<string> {
    try {
      return await this.inspectionUnitService.softDeleteInspectionUnit(user, id);
    } catch (error) {
      throw error;
    }
  }

  @Patch('restore/:id')
  @Roles('admin')
  async restoreInspectionUnit(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<InspectionUnitEntity> {
    try {
      return await this.inspectionUnitService.restoreInspectionUnit(user, id);

    } catch (error) {
      throw error;
    }
  }
}