import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEvaluationPointDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  pieceJointe?: string;
}
