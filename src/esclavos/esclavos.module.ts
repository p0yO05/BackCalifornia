import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsclavosService } from './esclavos.service';
import { EsclavosController } from './esclavos.controller';
import { Esclavo } from './entities/esclavo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Esclavo])],
  controllers: [EsclavosController],
  providers: [EsclavosService],
  exports: [EsclavosService],
})
export class EsclavosModule {}