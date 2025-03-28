import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattleController } from './battles.controller';
import { BattleService } from './battles.service';
import { Battle } from './entities/battle.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [TypeOrmModule.forFeature([Battle, Esclavo, Dictador]),PassportModule.register({ defaultStrategy: 'jwt' })], // Registra las entidades necesarias
  controllers: [BattleController], // Controlador para manejar las rutas
  providers: [BattleService], // Servicio para la lógica de negocio
  exports: [BattleService], // Exporta el servicio si otros módulos lo necesitan
})
export class BattleModule {}