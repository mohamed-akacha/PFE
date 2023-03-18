import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectionUnitEntity } from './entities/inspection-unit.entity';

@Injectable()
export class InspectionUnitService {
    constructor(
        @InjectRepository(InspectionUnitEntity)
        private readonly unitRepository: Repository<InspectionUnitEntity>,
    ) { }

    async getUnitById(id?: number): Promise<InspectionUnitEntity | null> {
        const unit = await this.unitRepository
          .createQueryBuilder('unit')
          .where('unit.id = :id', { id })
          .getOne();
        return unit || null;
      }
      
}
