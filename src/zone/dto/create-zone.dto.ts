import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateZoneDto {
  @ApiProperty({ description: "Le nom de la zone géographique", 
  example: "sfax",
   required: true })
  @IsNotEmpty()
  @IsString()
  nom: string;
}
