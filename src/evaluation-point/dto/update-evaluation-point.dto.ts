import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';

export class UpdateEvaluationPointDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(InspectionType)
  @IsNotEmpty()
  type?: InspectionType;


  /* @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  pieceJointe?: string; */
}
