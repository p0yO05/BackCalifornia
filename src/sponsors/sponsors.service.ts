import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Injectable()
export class SponsorService {
  constructor(
    @InjectRepository(Sponsor)
    private readonly sponsorRepository: Repository<Sponsor>,

    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
  ) {}

  async create(createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
    const { preferred_fighter, ...rest } = createSponsorDto;

    const fighter = await this.esclavoRepository.findOne({ where: { id: preferred_fighter } });
    if (!fighter) {
      throw new NotFoundException(`There is Not Preferred Fighter at the moment`);
    }

    const newSponsor = this.sponsorRepository.create({
      ...rest,
      preferred_fighter: fighter,     // campeon corporativo aqui
    });

    return this.sponsorRepository.save(newSponsor);
  }

  async findAll(): Promise<Sponsor[]> {
    return this.sponsorRepository.find();
  }

  async findOne(id: string): Promise<Sponsor> {
    const sponsor = await this.sponsorRepository.findOne({ where: { id } });
    if (!sponsor) {
      throw new NotFoundException(`Sponsor with ID ${id} not found`);
    }
    return sponsor;
  }

  async update(id: string, updateSponsorDto: UpdateSponsorDto): Promise<Sponsor> {
    const sponsor = await this.findOne(id);
    const { preferred_fighter, ...rest } = updateSponsorDto;

    if (preferred_fighter) {
      const fighter = await this.esclavoRepository.findOne({ where: { id: preferred_fighter } });
      if (!fighter) {
        throw new NotFoundException(`Our Company Hero Died...oh Well do you Want to be the next?`);
      }
      sponsor.preferred_fighter = fighter;
    }

    Object.assign(sponsor, rest);
    return this.sponsorRepository.save(sponsor);
  }

  async remove(id: string): Promise<void> {
    const sponsor = await this.findOne(id);
    await this.sponsorRepository.remove(sponsor);
  }
}
