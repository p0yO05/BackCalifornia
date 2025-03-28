import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { BetService } from './dictador-bets.service';
import { CreateBetDto } from './dto/create-dictador-bet.dto';
import { RoleGuardGuard } from 'src/role-guard/role-guard.guard';
import { AuthGuard } from '@nestjs/passport';
@Controller('bets')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Post()
  @UseGuards(AuthGuard(), RoleGuardGuard)
  @HttpCode(HttpStatus.CREATED) //Http 201
  create(@Body() createBetDto: CreateBetDto) {
    return this.betService.create(createBetDto);
  }

  @Get()
  findAll() {
    return this.betService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.betService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RoleGuardGuard)
  @HttpCode(HttpStatus.NO_CONTENT) //Http 204 siempre son asi
  remove(@Param('id') id: string) {
    return this.betService.remove(id);
  }
}

