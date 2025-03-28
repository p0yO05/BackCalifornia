import { Module } from '@nestjs/common';
import { SponsorshipService } from './sponsorship.service';
import { SponsorshipController } from './sponsorship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsor } from '../sponsors/entities/sponsor.entity'; // Import the Sponsor entity
import { Esclavo } from '../esclavos/entities/esclavo.entity';
import { Sponsorship } from './entities/sponsorship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sponsorship, Sponsor, Esclavo])], // Include the Sponsor entity
  controllers: [SponsorshipController],
  providers: [SponsorshipService],
  exports: [SponsorshipService]
})
export class SponsorshipModule {}
