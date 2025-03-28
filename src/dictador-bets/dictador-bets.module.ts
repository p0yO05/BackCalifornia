import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetController } from './dictador-bets.controller';
import { BetService } from './dictador-bets.service';
import { Bet } from './entities/dictador-bet.entity';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Battle } from '../battles/entities/battle.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Bet, Dictador, Esclavo, Battle]),PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [BetController],
  providers: [BetService],
  exports: [BetService],
})
export class BetModule {}

