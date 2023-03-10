import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';
import { UserEntity } from 'src/user/entities/user.entity';


export class UpdateInspectionDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  datePrevue: Date;

  @IsOptional()
  @IsEnum(InspectionType)
  type: InspectionType;

  @IsOptional()
  @IsBoolean()
  statut: boolean;


  @IsOptional()
  @IsDateString()
  dateInspection : Date;


  @IsNumber()
  @IsOptional()
  inspecteurId: number; // le champ inspecteur est facultatif
}
