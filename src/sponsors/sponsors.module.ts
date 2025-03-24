import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorController } from './sponsors.controller';
import { SponsorService } from './sponsors.service';
import { Sponsor } from './entities/sponsor.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sponsor, Esclavo])],
  controllers: [SponsorController],
  providers: [SponsorService],
  exports: [SponsorService],
})
export class SponsorModule {}
