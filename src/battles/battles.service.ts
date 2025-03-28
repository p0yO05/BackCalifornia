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
    private readonly BattleRepository: Repository<Battle>,

    @InjectRepository(Dictador)
    private readonly dictadorRepository: Repository<Dictador>,

    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
  ) {}

  async create(createBattleDto: CreateBattleDto): Promise<Battle> {
    const { organizerId, contestant_1_id, contestant_2_id, ...rest } = createBattleDto;
  
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
  
    // Restriction: Dead slaves cannot fight
    if (contestant_1.status === 'Dead' || contestant_2.status === 'Dead') {
      throw new Error('Dead slaves cannot participate in battles');
    }
  
    // Determine the winner based on strength and agility
    const contestant_1_score = contestant_1.strength + contestant_1.agility;
    const contestant_2_score = contestant_2.strength + contestant_2.agility;

    let winner_id: string;
    if (contestant_1_score > contestant_2_score) {
      winner_id = contestant_1.id;
    } else if (contestant_2_score > contestant_1_score) {
      winner_id = contestant_2.id;
    } else {
      throw new Error('The battle is a draw, no winner can be determined');
    }
    // Update stats for both contestants
    const queryRunner = this.BattleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      if (winner_id === contestant_1_id) {
        contestant_1.wins += 1;
        contestant_2.losses += 1;
      
      } else if (winner_id === contestant_2_id) {
        contestant_2.wins += 1;
        contestant_1.losses += 1;

      }
  
// Save updated slaves
      await queryRunner.manager.save(contestant_1);
      await queryRunner.manager.save(contestant_2);
  
      // Create and save the battle
      const battle = this.BattleRepository.create({
        organizer,
        contestant_1,
        contestant_2,
        ...rest,
      });
  
      const savedBattle = await queryRunner.manager.save(battle);
  
      await queryRunner.commitTransaction();
      return savedBattle;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Battle[]> {
    return this.BattleRepository.find({ relations: ['organizer', 'contestant_1', 'contestant_2'] });
  }

  async findOne(id: string): Promise<Battle> {
    const specialEvent = await this.BattleRepository.findOne({ where: { id }, relations: ['organizer', 'contestant_1', 'contestant_2'] });
    if (!specialEvent) {
      throw new NotFoundException(`Special Event with ID ${id} not found`);
    }
    return specialEvent;
  }

  async update(id: string, updateSpecialEventDto: CreateBattleDto): Promise<Battle> {
    const specialEvent = await this.findOne(id);
    Object.assign(specialEvent, updateSpecialEventDto);
    return this.BattleRepository.save(specialEvent);
  }

  async remove(id: string): Promise<void> {
    const specialEvent = await this.findOne(id);
    await this.BattleRepository.remove(specialEvent);
  }
}