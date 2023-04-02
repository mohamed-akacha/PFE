import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CreateBlocDto } from '../dto/create-bloc.dto';

export class UpdateBlocDto extends PartialType(CreateBlocDto) {
  @ApiProperty({
    required: false,
    description: "Le code du bloc. Doit être une chaîne de caractères.",
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    required: false,
    description: "Le nom du bloc. Doit être une chaîne de caractères.",
  })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiProperty({
    required: false,
    description: "L'étage du bloc. Doit être un nombre entier supérieur ou égal à zéro.",
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  etage?: number;

  @ApiProperty({
    required: false,
    description: "L'identifiant de l'unité d'inspection du bloc. Doit être un nombre entier.",
  })
  @IsOptional()
  @IsInt()
  inspectionUnitId?: number;
}
