import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsclavosService } from './esclavos.service';
import { EsclavosController } from './esclavos.controller';
import { Esclavo } from './entities/esclavo.entity';
import { DictadorsModule } from 'src/dictadors/dictadors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Esclavo]), DictadorsModule],
  controllers: [EsclavosController],
  providers: [EsclavosService],
  exports: [EsclavosService],
})
export class EsclavosModule {}