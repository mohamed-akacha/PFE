import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';


export class AddInspectionDto {

  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  datePrevue: Date;

  /* @IsOptional()
  @IsBoolean()
  statut: boolean;


  @IsOptional()
  @IsDate()
  dateInspection : Date; 
 */
  @IsNotEmpty()
  @IsEnum(InspectionType)
  type: InspectionType;

  @IsNumber()
  @IsOptional()
  inspecteurId?: number; // le champ inspecteur est facultatif


  @IsNumber()
  @IsOptional()
  unitId?: number;
}
