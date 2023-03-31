import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsNumber, IsDate, IsNotEmpty, IsInt } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInspectionDto {

  @ApiPropertyOptional({
    description: 'Description de l\'inspection',
    example: 'Inspection de sécurité mensuelle',
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Date prévue de l\'inspection',
    example: '2023-04-01',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  datePrevue: Date;

  @ApiPropertyOptional({
    description: 'Type d\'inspection',
    enum: InspectionType,
    example: InspectionType.Externe,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(InspectionType)
  type: InspectionType;

  /* @IsOptional()
  @IsBoolean()
  statut: boolean;

  @IsOptional()
  @IsDate()
  dateInspection : Date; 
  */

  @ApiPropertyOptional({
    description: 'Identifiant de l\'inspecteur en charge de l\'inspection',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsInt()
  @IsOptional()
  inspecteurId?: number; // le champ inspecteur est facultatif

  @ApiPropertyOptional({
    description: 'Identifiant de l\'unité inspectée',
    example: 2,
    required: false
  })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  unitId?: number;
}
