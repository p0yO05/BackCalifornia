import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BetService } from './dictador-bets.service';
import { CreateBetDto } from './dto/create-dictador-bet.dto';
import { UpdateBetDto } from './dto/create-dictador-bet.dto';

@Controller('bets')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) //Http 201
  create(@Body() createBetDto: CreateBetDto) {
    return this.betService.create(createBetDto);
  }

  @Get()
  findAll() {
    return this.betService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.betService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    return this.betService.update(id, updateBetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) //Http 204 siempre son asi
  remove(@Param('id') id: string) {
    return this.betService.remove(id);
  }
}

