import { Module } from '@nestjs/common';
import { BlocService } from './bloc.service';
import { BlocController } from './bloc.controller';

@Module({
  controllers: [BlocController],
  providers: [BlocService],
  exports:[BlocService]
})
export class BlocModule {}
