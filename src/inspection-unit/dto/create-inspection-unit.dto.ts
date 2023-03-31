import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInspectionUnitDto {
  @ApiProperty({
    example: 'Nom de l\'unité d\'inspection',
    description: 'Le nom de l\'unité d\'inspection',
  })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty({
    example: 'Code de l\'unité d\'inspection',
    description: 'Le code de l\'unité d\'inspection',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    example: '1',
    description: 'L\'ID de l\'institution à laquelle l\'unité d\'inspection appartient',
  })
  @IsInt()
  institutionId: number;
}