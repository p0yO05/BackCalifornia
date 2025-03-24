import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialEventsController } from './special-events.controller';
import { SpecialEventsService } from './special-events.service';
import { SpecialEvent } from './entities/special-event.entity';
import { Dictador } from 'src/dictadors/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialEvent, Dictador, Esclavo])],
  controllers: [SpecialEventsController],
  providers: [SpecialEventsService],
})
export class SpecialEventsModule {}