import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EsclavosService } from './esclavos.service';
import { CreateEsclavoDto } from './dto/create-esclavo.dto';
import { UpdateEsclavoDto } from './dto/update-esclavo.dto';
import { RoleGuardGuard } from 'src/role-guard/role-guard.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller('esclavos')
export class EsclavosController {
  constructor(private readonly esclavosService: EsclavosService) {}

  @Post()

  create(@Body() createEsclavoDto: CreateEsclavoDto) {
    return this.esclavosService.create(createEsclavoDto);
  }

  @Get()
  findAll() {
    return this.esclavosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.esclavosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEsclavoDto: UpdateEsclavoDto) {
    return this.esclavosService.update(id, updateEsclavoDto);
  }

  @Delete(':id')

  remove(@Param('id') id: string) {
    return this.esclavosService.remove(id);
  }
}