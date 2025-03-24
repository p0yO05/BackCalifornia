import { Module } from '@nestjs/common';
import { DictadorsService } from './dictadors.service';
import { DictadorsController } from './dictadors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Dictador } from './entities/dictador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dictador,Esclavo])],
  controllers: [DictadorsController],
  providers: [DictadorsService],
  exports: [DictadorsService,TypeOrmModule],
})
export class DictadorsModule {}
