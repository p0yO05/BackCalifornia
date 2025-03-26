import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBattleDto } from './dto/create-battle.dto';
import { Battle } from './entities/battle.entity';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(Battle)
    private readonly specialEventRepository: Repository<Battle>,

    @InjectRepository(Dictador)
    private readonly dictadorRepository: Repository<Dictador>,

    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
  ) {}

  async create(createSpecialEventDto: CreateBattleDto): Promise<Battle> {
    const { organizerId, contestant_1_id, contestant_2_id, ...rest } = createSpecialEventDto;

    const organizer = await this.dictadorRepository.findOne({ where: { id: organizerId } });
    if (!organizer) {
      throw new NotFoundException(`Dictador with ID ${organizerId} not found`);
    }

    const contestant_1 = await this.esclavoRepository.findOne({ where: { id: contestant_1_id } });
    if (!contestant_1) {
      throw new NotFoundException(`Contestant with ID ${contestant_1_id} not found`);
    }

    const contestant_2 = await this.esclavoRepository.findOne({ where: { id: contestant_2_id } });
    if (!contestant_2) {
      throw new NotFoundException(`Contestant with ID ${contestant_2_id} not found`);
    }

    const specialEvent = this.specialEventRepository.create({
      organizer,
      contestant_1,
      contestant_2,
      ...rest, 
    });

    return this.specialEventRepository.save(specialEvent);
  }

  async findAll(): Promise<Battle[]> {
    return this.specialEventRepository.find({ relations: ['organizer', 'contestant_1', 'contestant_2'] });
  }

  async findOne(id: string): Promise<Battle> {
    const specialEvent = await this.specialEventRepository.findOne({ where: { id }, relations: ['organizer', 'contestant_1', 'contestant_2'] });
    if (!specialEvent) {
      throw new NotFoundException(`Special Event with ID ${id} not found`);
    }
    return specialEvent;
  }

  async update(id: string, updateSpecialEventDto: CreateBattleDto): Promise<Battle> {
    const specialEvent = await this.findOne(id);
    Object.assign(specialEvent, updateSpecialEventDto);
    return this.specialEventRepository.save(specialEvent);
  }

  async remove(id: string): Promise<void> {
    const specialEvent = await this.findOne(id);
    await this.specialEventRepository.remove(specialEvent);
  }
}