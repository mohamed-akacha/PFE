import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlocDto } from './dto/create-bloc.dto';
import { UpdateBlocDto } from './dto/update-bloc.dto';
import { BlocEntity } from './entities/bloc.entity';

@Injectable()
export class BlocService {
  constructor(
    @InjectRepository(BlocEntity)
    private readonly blocRepository: Repository<BlocEntity>,
  ) {}
  create(createBlocDto: CreateBlocDto) {
    return 'This action adds a new bloc';
  }

  findAll() {
    return `This action returns all bloc`;
  }

  async getBlocById(id: number): Promise<BlocEntity> {
    const bloc = await this.blocRepository.createQueryBuilder('bloc')
      .where('bloc.id = :id', { id })
      .getOneOrFail();
    return bloc;
  }
  
  async getBlocsByIds(blocIds: number[]): Promise<BlocEntity[]> {
    const blocs = await this.blocRepository.createQueryBuilder('bloc')
      .where('bloc.id IN (:...blocIds)', { blocIds })
      .getMany();
    return blocs;
  }

  update(id: number, updateBlocDto: UpdateBlocDto) {
    return `This action updates a #${id} bloc`;
  }

  remove(id: number) {
    return `This action removes a #${id} bloc`;
  }
  async getBlocksByUnit(unitId: number): Promise<BlocEntity[]> {
    return await this.blocRepository.find({
      where: {
        inspectionUnit: { id: unitId },
      },
    });
  }
}
