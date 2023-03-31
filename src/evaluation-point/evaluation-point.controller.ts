import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';

import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { AddEvaluationPointDto } from './dto/add-evaluation-point.dto';
import { UpdateEvaluationPointDto } from './dto/update-evaluation-point.dto';
import { EvaluationPointEntity } from './entities/evaluation-point.entity';
import { EvaluationPointService } from './evaluation-point.service';

@ApiTags("Points d'evaluation")
@Controller('evaluation-points')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard,RoleGuard)
export class EvaluationPointController {
  constructor(private readonly evaluationPointService: EvaluationPointService) {}

  
  @Post()
  @Roles('admin')
  async createEvaluationPoint(@User() user: UserEntity, @Body() addEvaluationPointDto: AddEvaluationPointDto): Promise<Partial<EvaluationPointEntity>> {
    try {
    return await this.evaluationPointService.createEvaluationPoint(user, addEvaluationPointDto);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new NotFoundException(error.message);
  }
  }

  @Get()
  @Roles('admin','user')
  async getAllEvaluationPoints(): Promise<EvaluationPointEntity[]> {
    try {
    return await this.evaluationPointService.getAllEvaluationPoints();
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new NotFoundException(error.message);
  }
  }


  @Get(':id')
  @Roles('admin','user')
  async getEvaluationPointById(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity): Promise<EvaluationPointEntity> {
    try {
    return await this.evaluationPointService.getEvaluationPointById(id, user);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new NotFoundException(error.message);
  }
  }

  @Put(':id')
  @Roles('admin')
  async updateEvaluationPoint(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEvaluationPointDto: UpdateEvaluationPointDto,
  ): Promise<EvaluationPointEntity> {
    try {
    return await this.evaluationPointService.updateEvaluationPoint(user, id, updateEvaluationPointDto);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new NotFoundException(error.message);
  }
  }

  @Delete(':id')
  @Roles('admin')
  async softDeleteEvaluationPoint(@User() user: UserEntity, @Param('id', ParseIntPipe) evaluationPointId: number): Promise<string> {
    try {
    return await this.evaluationPointService.softDeleteEvaluationPoint(user, evaluationPointId);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new NotFoundException(error.message);
  }
  }

  @Put('restore/:id')
  @Roles('admin')
  async restoreEvaluationPoint(@User() user: UserEntity, @Param('id', ParseIntPipe) evaluationPointId: number): Promise<EvaluationPointEntity> {
    try {
    return await this.evaluationPointService.restoreEvaluationPoint(user, evaluationPointId);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new NotFoundException(error.message);
  }
  }

  @Delete('force/:id')
  @Roles('admin')
  async deleteEvaluationPoint(@User() user: UserEntity, @Param('id', ParseIntPipe) evaluationPointId: number): Promise<string> {
    try {
    return await this.evaluationPointService.deleteEvaluationPoint(user, evaluationPointId);
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new NotFoundException(error.message);
  }
  }
}
