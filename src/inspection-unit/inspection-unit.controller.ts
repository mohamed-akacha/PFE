import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Inspection units")
@Controller('inspection-unit')
export class InspectionUnitController {}
