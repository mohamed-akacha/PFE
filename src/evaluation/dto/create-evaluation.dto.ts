import { IsNumber, IsString, IsOptional, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateEvaluationDto {

  @IsNotEmpty()
  @IsNumber()
  inspectionId: number;

  @IsNotEmpty()
  @IsNumber()
  blocId: number;

  @IsNotEmpty()
  @IsNumber()
  evaluationPointId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;

  @IsString()
  @IsOptional()
  pieceJointe?: string;
}
