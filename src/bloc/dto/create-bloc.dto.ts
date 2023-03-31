import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBlocDto {
  @ApiProperty({
    required: true,
    example: 'B01',
    description: 'Code du bloc',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    required: true,
    example: 'Bloc A',
    description: 'Nom du bloc',
  })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Numéro d\'étage du bloc',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  etage: number;

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Identifiant de l\'unité d\'inspection associée au bloc',
  })
  @IsNotEmpty()
  @IsInt()
  inspectionUnitId: number;
}
