import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EsclavosService } from './esclavos.service';
import { EsclavosController } from './esclavos.controller';
import { Esclavo } from './entities/esclavo.entity';
import { DictadorsModule } from 'src/dictators/dictadors.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Esclavo]), DictadorsModule, PassportModule.register({ defaultStrategy: 'jwt' })], // Registra las entidades necesarias
  controllers: [EsclavosController],
  providers: [EsclavosService],
  exports: [EsclavosService],
})
export class EsclavosModule {}
