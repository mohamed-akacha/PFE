import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, InternalServerErrorException, Param, Post, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { BlocService } from 'src/bloc/bloc.service';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { EvaluationDtoValidationPipe } from 'src/pipes/evaluation-dto-validation.pipe';
import { EvaluationPointService } from 'src/evaluation-point/evaluation-point.service';
import { InspectionService } from 'src/inspection/inspection.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { RoleGuard } from 'src/user/guards/rôles.guard';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { EvaluationDataDto } from './dto/evaluation-data.dto';
import { EvaluationEntity } from './entities/evaluation.entity';
import { EvaluationService } from './evaluation.service';
import { ApiTags } from '@nestjs/swagger';
import { TypeORMError } from 'typeorm';

@ApiTags('Evaluations')
@Controller('evaluations')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RoleGuard)
export class EvaluationController {
  constructor(
    private readonly inspectionService: InspectionService,
    private readonly blocService: BlocService,
    private readonly evaluationPointService: EvaluationPointService,
    private readonly evaluationService: EvaluationService,
  ) { }

  @Get(':inspectionId')
  @Roles('user')
  async getEvaluationData(@User() user: UserEntity,
    @Param('inspectionId') inspectionId: number): Promise<EvaluationDataDto> {
    const inspection = await this.inspectionService.getInspectionById(user, inspectionId);

    const blocs = await this.blocService.getBlocksByUnit(inspection.unit.id);
    const criteria = await this.evaluationPointService.getPointsByType(inspection.type);
    return {
      inspection,
      blocs,
      criteria,
    };
  }

  @Post()
@Roles('user','admin')
//@UsePipes()
async saveEvaluation(
  @Body(EvaluationDtoValidationPipe) evaluationDtos: CreateEvaluationDto[],
): Promise<EvaluationEntity[]> {
  try {
    const evaluations = await Promise.all(
      evaluationDtos.map((evaluationDto) =>
        this.evaluationService.saveEvaluation(evaluationDto),
      ),
    );
    return evaluations;
  } catch (error) {
     if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new BadRequestException("L'ID fourni ne correspond à aucun enregistrement dans la base de données.");
    } else if (error instanceof TypeORMError) {
      throw new InternalServerErrorException('Une erreur s\'est produite lors de l\'enregistrement des évaluations.');
    } else { 
      throw error;
    }
  }
}


}




