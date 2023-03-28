import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { BlocService } from './bloc.service';
import { CreateBlocDto } from './dto/create-bloc.dto';
import { UpdateBlocDto } from './dto/update-bloc.dto';

@Controller('blocs')
@UseGuards(JwtAuthGuard,RoleGuard)
export class BlocController {
  constructor(private readonly blocService: BlocService) {}

  @Post()
  @Roles('admin')
  async createBloc(@User() user: UserEntity, @Body() createBlocDto: CreateBlocDto) {
    try {
      const bloc = await this.blocService.createBloc(user, createBlocDto);
      return { bloc };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('admin','user')
  async getAllBlocs() {
    try {
      const blocs = await this.blocService.geAlltBlocs();
      return { blocs };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles('admin','user')
  async getOneById(@Param('id', ParseIntPipe) id: number) {
    try {
      const bloc = await this.blocService.getOneById(id);
      return { bloc };
    } catch (error) {
      throw error;
    }
  }

  @Get('/units/:unitId')
  async getBlocksByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    try {
      const blocs = await this.blocService.getBlocksByUnit(unitId);
      return { blocs };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateBloc(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @Body() updateBlocDto: UpdateBlocDto,
  ) {
    try {
      const bloc = await this.blocService.updateBloc(id, updateBlocDto, user);
      return { bloc };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async softDeleteBloc(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    try {
      const message = await this.blocService.softDeleteBloc(user, id);
      return { message };
    } catch (error) {
      throw error;
    }
  }

  @Patch('restore/:id')
  async restoreBloc(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    try {
      const bloc = await this.blocService.restoreBloc(user, id);
      return { bloc };
    } catch (error) {
      throw error;
    }
  }

  @Delete('force/:id')
  @Roles('admin')
  async deleteEvaluationPoint(@User() user: UserEntity, @Param('id', ParseIntPipe) blocId: number): Promise<string> {
    try {
    return await this.blocService.deleteBloc(user, blocId);
  }   catch (error) {
    throw error;
  }
  }
}
