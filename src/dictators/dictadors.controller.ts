import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DictadorsService } from './dictadors.service';
import { CreateDictadorDto } from './dto/create-dictador.dto';
import { UpdateDictadorDto } from './dto/update-dictador.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuardGuard } from 'src/role-guard/role-guard.guard';

@Controller('dictadors')
export class DictadorsController {
  constructor(private readonly dictadorsService: DictadorsService) {}

  @Post()

  create(@Body() createDictadorDto: CreateDictadorDto) {
    return this.dictadorsService.create(createDictadorDto);
  }
  @Get()

  findAll() {
    return this.dictadorsService.findAll();
  }
  
  @Get(':id')

  findOne(@Param('id') id: string) {
    return this.dictadorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictadorDto: UpdateDictadorDto) {
    return this.dictadorsService.update(id, updateDictadorDto);
  }

  @Delete(':id')

  remove(@Param('id') id: string) {
    return this.dictadorsService.remove(id);
  }
}