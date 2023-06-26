import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Put
} from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { ZoneEntity } from './entities/zone.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@ApiTags('zones')
@ApiBearerAuth()
@Controller('zones')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Post()
  @Roles('admin')
  async createZone(
    @User() user: UserEntity,
    @Body() createZoneDto: CreateZoneDto,
  ): Promise<ZoneEntity> {
    try {
      return await this.zoneService.createZone(createZoneDto,user);
      
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('admin', 'user')
  async getAllZones(): Promise<ZoneEntity[]> {
    try {
      return  await this.zoneService.getAllZones();
  
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getZoneById(@Param('id', ParseIntPipe) id: number): Promise<ZoneEntity> {
    try {
      const zone = await this.zoneService.getZoneById(id);
      
      return zone;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @Roles('admin')
  async updateZone(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @Body() updateZoneDto: UpdateZoneDto,
  ): Promise<Partial<ZoneEntity>> {
    try {
      return await this.zoneService.updateZone(id, updateZoneDto, user);

    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles('admin')
  async softDeleteZone(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<string> {
    try {
      return await this.zoneService.softDeleteZone(user, id);
    } catch (error) {
      throw error;
    }
  }

  @Patch('restore/:id')
  @Roles('admin')
  async restoreZone(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<ZoneEntity> {
    try {
      return await this.zoneService.restoreZone(user, id);

    } catch (error) {
      throw error;
    }
  }

  @Delete('force/:id')
  @Roles('admin')
  async deleteZone(@Param('id', ParseIntPipe) id: number,@User() user: UserEntity): Promise<{ message:string }>{
    try {
      return await this.zoneService.deleteZone(user, id);
    } catch (error) {
      throw error;
    }
  }
}