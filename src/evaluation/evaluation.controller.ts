import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
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

  @Post(':inspectionId')
  @Roles('user')
  async saveEvaluation(
    @User() user: UserEntity,
    @Param('inspectionId') inspectionId: number,
    @Body(EvaluationDtoValidationPipe) evaluationDtos: CreateEvaluationDto[],
  ): Promise<EvaluationEntity[]> {
    // Récupérer tous les blocs et points d'évaluation nécessaires en une seule requête
    const blocIds = evaluationDtos.map(evaluationDto => evaluationDto.blocId);
    const evaluationPointIds = evaluationDtos.map(evaluationDto => evaluationDto.evaluationPointId);
    const [blocs, evaluationPoints] = await Promise.all([
      this.blocService.getBlocsByIds(blocIds),
      this.evaluationPointService.getEvaluationPointsByIds(evaluationPointIds),
    ]);

    // Récupérer l'inspection à laquelle les évaluations doivent être liées
    const inspection = await this.inspectionService.getInspectionById(user, inspectionId);

    // Créer toutes les évaluations en une seule requête
    const evaluations = evaluationDtos.map((evaluationDto, index) => {
      const evaluation = new EvaluationEntity();
      evaluation.score = evaluationDto.score;
      evaluation.pieceJointe = evaluationDto.pieceJointe;
      evaluation.bloc = blocs[index];
      evaluation.inspection = inspection;
      evaluation.evaluationPoint = evaluationPoints[index];
      return evaluation;
    });

    return this.evaluationService.save(evaluations);

  }



}
