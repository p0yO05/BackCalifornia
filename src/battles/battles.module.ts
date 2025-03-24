import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesController } from './battles.controller';
import { BattleService } from './battles.service';
import { Battle } from './entities/battle.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Battle, Esclavo])], // Registra la batalla
  controllers: [BattlesController], // Controlador para manejar las rutas                     // Maneja
  providers: [BattleService], // Servicio para la lógica de negocio                           // logicstica
  exports: [BattleService], // Exporta el servicio si otros módulos lo necesitan                // Otros
})
export class BattleModule {}
