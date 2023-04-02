import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InspectionType } from 'src/enums/inspec-type.enum';

export class AddEvaluationPointDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "La description de l'évaluation",
    example: "Vérifier si la pièce est bien fixée"
  })
  description: string;

  @IsNotEmpty()
  @IsEnum(InspectionType)
  @ApiProperty({
    description: "Le type d'inspection pour lequel cette évaluation est destinée",
    enum: InspectionType,
    example: InspectionType.Interne
  })
  type: InspectionType;

 /*  @IsOptional()
  @IsNumber()
  score?: number;

  @IsString()
  pieceJointe?: string; */

}
