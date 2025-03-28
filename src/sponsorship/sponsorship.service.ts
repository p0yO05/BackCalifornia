import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from 'src/sponsors/entities/sponsor.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Sponsorship } from './entities/sponsorship.entity';
import { CreateSponsorshipDto} from './dto/create-sponsorship.dto';
import { UpdateSponsorshipDto } from './dto/update-sponsorship.dto';
@Injectable()
export class SponsorshipService {
  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository: Repository<Sponsor>,

    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,

    @InjectRepository(Sponsorship)
    private readonly sponsorshipRepository: Repository<Sponsorship>,
  ) {}

  async create(createSponsorshipDto: CreateSponsorshipDto): Promise<Sponsorship> {
    const { sponsorId, esclavoId } = createSponsorshipDto;

    const sponsor = await this.sponsorRepository.findOne({ where: { id: sponsorId }});
    if (!sponsor) {
      throw new NotFoundException(`Sponsor with ID ${sponsorId} not found`);
    }

    const esclavo = await this.esclavoRepository.findOne({ where: { id: esclavoId }});
    if (!esclavo) {
      throw new NotFoundException(`Esclavo with ID ${esclavoId} not found`);
    }

    const newSponsorship = this.sponsorshipRepository.create({
      sponsor,
      esclavo,
    });

    sponsor.sponsorships.push(newSponsorship);
    await this.sponsorRepository.save(sponsor);
  
    // Add the new sponsorship to the esclavo's sponsorships array
    esclavo.sponsorships.push(newSponsorship);
    await this.esclavoRepository.save(esclavo);

    return this.sponsorshipRepository.save(newSponsorship);
  }
  async findAll(): Promise<Sponsorship[]> {
    const sponsorships = await this.sponsorshipRepository.find();
    return sponsorships;
  }

  async findOne(id: string): Promise<Sponsorship | undefined> {
    const sponsorship = await this.sponsorshipRepository.findOne({ where: { id } });
    if (!sponsorship) {
      throw new NotFoundException(`Sponsorship with ID ${id} not found`);
    }
    return sponsorship;
  }

  async remove(id: string): Promise<Sponsorship|void> {
    const sponsorship = await this.findOne(id);
    if (!sponsorship) {
      throw new NotFoundException(`Sponsorship with ID ${id} not found`);
    }
    await this.sponsorshipRepository.remove(sponsorship);
  }
}