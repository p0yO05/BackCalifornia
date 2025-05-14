import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { BattleService } from './battles.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { RoleGuardGuard } from 'src/role-guard/role-guard.guard';
import { AuthGuard } from '@nestjs/passport';
@Controller('battles')
export class BattleController {
  constructor(private readonly battlesService: BattleService) {}

  @Post()
  @UseGuards(AuthGuard(), RoleGuardGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBattleDto: CreateBattleDto) {
    return this.battlesService.create(createBattleDto);
  }

  @Get()
  async findAll() {
    return this.battlesService.findAll();
  }

  @Get(':id')

  async findOne(@Param('id') id: string) {
    return this.battlesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateBattleDto: CreateBattleDto) {
    return this.battlesService.update(id, updateBattleDto);
  }

  @Delete(':id')

  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.battlesService.remove(id);
  }
}