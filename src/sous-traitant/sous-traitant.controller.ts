import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/user/guards/jwt-auth.guard";
import { RoleGuard } from "src/user/guards/rôles.guard";
import { SousTraitantService } from "./sous-traitant.service";
import { Roles } from "src/decorators/roles.decorator";
import { User } from "src/decorators/user.decorator";
import { UserEntity } from "src/user/entities/user.entity";
import { CreateSousTraitantDto } from "./dto/create-sous-traitant.dto";
import { SousTraitantEntity } from "./entities/sous-traitant.entity";
import { UpdateSousTraitantDto } from "./dto/update-sous-traitant.dto";

@ApiTags('sous-traitant')
@Controller('sous-traitants')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class SousTraitantController {
  constructor(private readonly sousTraitantService: SousTraitantService) { }

  @Post()
  @Roles('admin')
  async createSousTraitant(@User() user: UserEntity,
    @Body() createSousTraitantDto: CreateSousTraitantDto): Promise<Partial<SousTraitantEntity>> {
    try {
      return await this.sousTraitantService.createSousTraitant(user, createSousTraitantDto);

    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('admin', 'user')
  async getAllSousTraitants(): Promise<SousTraitantEntity[]> {
    try {
      return await this.sousTraitantService.getAllSousTraitants();

    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<SousTraitantEntity> {
    try {
      return await this.sousTraitantService.getSousTraitantById(id);

    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateSousTraitant(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @Body() updateSousTraitantDto: UpdateSousTraitantDto,
  ): Promise<Partial<SousTraitantEntity>> {
    try {
      return await this.sousTraitantService.updateSousTraitant(id, updateSousTraitantDto, user);

    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async softDeleteSousTraitant(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<string> {
    try {
      return await this.sousTraitantService.softDeleteSousTraitant(user, id);

    } catch (error) {
      throw error;
    }
  }

  @Patch('restore/:id')
  async restoreSousTraitant(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<SousTraitantEntity> {
    try {
      return await this.sousTraitantService.restoreSousTraitant(user, id);

    } catch (error) {
      throw error;
    }
  }

  @Delete('force/:id')
  @Roles('admin')
  async deleteSousTraitant(@User() user: UserEntity,
    @Param('id', ParseIntPipe) sousTraitantId: number): Promise<{ message:string }> {
    try {
      return await this.sousTraitantService.deleteSousTraitant(user, sousTraitantId);
    } catch (error) {
      throw error;
    }
  }
}
