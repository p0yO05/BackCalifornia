import { Module } from '@nestjs/common';
import { DictadorsService } from './dictadors.service';
import { DictadorsController } from './dictadors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Dictador } from './entities/dictador.entity';
import { DictadorlogModule } from 'src/dictadorlog/dictadorlog.module';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    TypeOrmModule.forFeature([Dictador, Esclavo]),
    DictadorlogModule, PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [DictadorsController],
  providers: [DictadorsService],
  exports: [DictadorsService, TypeOrmModule],
})
export class DictadorsModule {}