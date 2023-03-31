import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateInspectionUnitDto {
    @ApiProperty({
      example: 'Nouveau nom de l\'unité d\'inspection',
      description: 'Le nouveau nom de l\'unité d\'inspection',
    })
    @IsOptional()
    @IsString()
    nom?: string;
  
    @ApiProperty({
      example: 'Nouveau code de l\'unité d\'inspection',
      description: 'Le nouveau code de l\'unité d\'inspection',
    })
    @IsOptional()
    @IsString()
    code?: string;
  
    @ApiProperty({
      example: '2',
      description: 'Le nouvel ID de l\'institution à laquelle l\'unité d\'inspection appartient',
    })
    @IsOptional()
    institutionId?: number;
  }
  
  