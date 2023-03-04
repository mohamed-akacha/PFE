import { IsNumber, IsString, IsOptional, IsNotEmpty, Max, Min } from 'class-validator';

export class AddEvaluationDto {

  @IsNotEmpty()
  @IsNumber()
  inspectionId: number;

  @IsNotEmpty()
  @IsNumber()
  evaluationPointId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  score: number;

  @IsString()
  @IsOptional()
  pieceJointe?: string;
}
