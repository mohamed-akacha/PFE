import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { BlocService } from './bloc.service';
import { CreateBlocDto } from './dto/create-bloc.dto';
import { UpdateBlocDto } from './dto/update-bloc.dto';
import { BlocEntity } from './entities/bloc.entity';

@ApiTags('block')
@Controller('blocs')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class BlocController {
  constructor(private readonly blocService: BlocService) { }

  @Post()
  @Roles('admin')
  async createBloc(@User() user: UserEntity,
    @Body() createBlocDto: CreateBlocDto): Promise<Partial<BlocEntity>> {
    try {
      return await this.blocService.createBloc(user, createBlocDto);

    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Roles('admin', 'user')
  async getAllBlocs(): Promise<BlocEntity[]> {
    try {
      return await this.blocService.getAlltBlocs();

    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Roles('admin', 'user')
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<BlocEntity> {
    try {
      return await this.blocService.getOneById(id);

    } catch (error) {
      throw error;
    }
  }

  @Get('/units/:unitId')
  @Roles('admin', 'user')
  async getBlocksByUnit(@Param('unitId', ParseIntPipe) unitId: number): Promise<BlocEntity[]> {
    try {
      return await this.blocService.getBlocksByUnit(unitId);

    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateBloc(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
    @Body() updateBlocDto: UpdateBlocDto,
  ): Promise<Partial<BlocEntity>> {
    try {
      return await this.blocService.updateBloc(id, updateBlocDto, user);

    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async softDeleteBloc(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<string> {
    try {
      return await this.blocService.softDeleteBloc(user, id);

    } catch (error) {
      throw error;
    }
  }

  @Patch('restore/:id')
  async restoreBloc(@Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity): Promise<BlocEntity> {
    try {
      return await this.blocService.restoreBloc(user, id);

    } catch (error) {
      throw error;
    }
  }

  @Delete('force/:id')
  @Roles('admin')
  async deleteBloc(@User() user: UserEntity,
    @Param('id', ParseIntPipe) blocId: number): Promise<string> {
    try {
      return await this.blocService.deleteBloc(user, blocId);
    } catch (error) {
      throw error;
    }
  }


}
