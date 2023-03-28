import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsNumber, IsDate, IsNotEmpty, IsInt } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';


export class UpdateInspectionDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  datePrevue: Date;

  
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
  
  @IsNumber()
  @IsInt()
  @IsOptional()
  inspecteurId?: number; // le champ inspecteur est facultatif

  
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  unitId?: number;
}
