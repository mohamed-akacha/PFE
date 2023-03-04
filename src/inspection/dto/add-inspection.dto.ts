import { IsNotEmpty, IsBoolean, IsDateString, IsEnum, IsNumber, IsArray } from 'class-validator';
import { InspectionType } from 'src/enums/inspec-type.enum';

export class AddInspectionDto {

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  datePrevue: Date;

  @IsNotEmpty()
  @IsDateString()
  dateInspection: Date;

  @IsBoolean()
  statut?: boolean = false;

  @IsNotEmpty()
  @IsEnum(InspectionType)
  type: InspectionType;

  
}
