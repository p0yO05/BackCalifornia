import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BattleService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';

@Controller('battles')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  // Crear una nueva batalla
  @Post()
  @HttpCode(HttpStatus.CREATED) //Http 201
  async create(@Body() createBattleDto: CreateBattleDto) {
    return this.battleService.create(createBattleDto);
  }

  // Obtener todas las batallas
  @Get()
  async findAll() {
    return this.battleService.findAll();
  }

  // Obtener una batalla específica por su ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.battleService.findOne(id);
  }

  // Actualizar una batalla (estadísticas)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateBattleDto: UpdateBattleDto) {
    return this.battleService.update(id, updateBattleDto);
  }

  // Eliminar una batalla
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // http 204
  async remove(@Param('id') id: string) {
    await this.battleService.remove(id);
  }
}
