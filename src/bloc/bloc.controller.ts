import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlocService } from './bloc.service';
import { CreateBlocDto } from './dto/create-bloc.dto';
import { UpdateBlocDto } from './dto/update-bloc.dto';

@Controller('bloc')
export class BlocController {
  constructor(private readonly blocService: BlocService) {}

  @Post()
  create(@Body() createBlocDto: CreateBlocDto) {
    return this.blocService.create(createBlocDto);
  }

  @Get()
  findAll() {
    return this.blocService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocService.getBlocById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlocDto: UpdateBlocDto) {
    return this.blocService.update(+id, updateBlocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blocService.remove(+id);
  }
}
