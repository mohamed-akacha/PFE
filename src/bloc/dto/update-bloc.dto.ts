import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CreateBlocDto } from './create-bloc.dto';

export class UpdateBlocDto extends PartialType(CreateBlocDto) {
    @IsOptional()
    @IsString()
    code?: string;
  
    @IsOptional()
    @IsString()
    nom?: string;
  
    @IsOptional()
    @IsInt()
    @Min(0)
    etage?: number;
  
    @IsOptional()
    @IsInt()
    inspectionUnitId?: number;
}
