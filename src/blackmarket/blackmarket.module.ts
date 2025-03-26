import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackMarketTransaction } from './entities/blackmarket.entity';
import { BlackmarketService } from './blackmarket.service';
import { BlackMarketController } from './blackmarket.controller';
import { EsclavosModule } from 'src/esclavos/esclavos.module'; // Importa el módulo de Esclavos
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { DictadorsModule } from 'src/dictators/dictadors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlackMarketTransaction, Dictador]),
    EsclavosModule,
    DictadorsModule, // Importamos el módulo de Dictadores
  ],
  controllers: [BlackMarketController],
  providers: [BlackmarketService],
  exports: [BlackmarketService],
})
export class BlackmarketModule {}
