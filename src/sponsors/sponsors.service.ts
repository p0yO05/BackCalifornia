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
    const { preferred_fighter, company_name, donated_items } = createSponsorDto;

    const fighter = await this.esclavoRepository.findOne({ where: { id: preferred_fighter } });
    if (!fighter) {
      throw new NotFoundException(`There is Not Preferred Fighter at the moment`);
    }

    fighter.sponsorships = fighter.sponsorships || [];
    donated_items.split(" ").forEach((item) => {
      const buff = Math.round(Math.random() * 5);
      fighter.agility = fighter.agility + buff > 100 ? 100 : fighter.agility + buff;
      fighter.strength = fighter.strength + buff > 100 ? 100 : fighter.strength + buff;
      if (item === "Una Lata de Espinaca") {
        fighter.agility = 100;
        fighter.strength = 100;
      } else if ( item === "La Espada del olimpo") {
        fighter.agility = 100;
        fighter.strength = 100;
      } else if (item === "una cuchara- TIENE UNA CUCHARA") {
        fighter.agility = 65;
        fighter.strength = 40;
      } else if (item === "La Doom Shotgun"){
        fighter.agility = 64;
        fighter.strength = 64;
      } else if (item == "Un Sandevistan Grado Militar"){
        fighter.agility = 100;
        fighter.strength = 30;
      } else if (item == "El enchiridion"){
        fighter.agility = 100;
        fighter.strength = 100;
      } else if (item == "Una Bandana de Municion Infinita"){
        fighter.agility = 100;
        fighter.strength = 40;
      } else if (item === "Un sable de luz"){
        fighter.agility = 100;
        fighter.strength = 100;
      } else if (item === "La Chancla"){
        fighter.agility = 100;
        fighter.strength = 100;
      }
    });

    const newSponsor = this.sponsorRepository.create({
      company_name,
      donated_items,
      preferred_fighter: fighter,
    });

    fighter.sponsorships.push(newSponsor);
    await this.esclavoRepository.save(fighter);
    newSponsor.preferred_fighter=fighter;
    
    return await this.sponsorRepository.save(newSponsor);
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
