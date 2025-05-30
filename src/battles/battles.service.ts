import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBattleDto } from './dto/create-battle.dto';
import { Battle } from './entities/battle.entity';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Estado } from 'src/esclavos/entities/estado.enum';

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

    if (organizer.loyalty_to_Carolina === 0) {
      throw new BadRequestException('A disloyal dictador cannot organize battles');
    }

    const contestant_1 = await this.esclavoRepository.findOne({ where: { id: contestant_1_id } });
    if (!contestant_1) {
      throw new NotFoundException(`Contestant with ID ${contestant_1_id} not found`);
    }

    const contestant_2 = await this.esclavoRepository.findOne({ where: { id: contestant_2_id } });
    if (!contestant_2) {
      throw new NotFoundException(`Contestant with ID ${contestant_2_id} not found`);
    }

    if (contestant_1.status === Estado.Dead || contestant_2.status === Estado.Dead) {
      throw new Error('Dead slaves cannot participate in battles');
    }
    if (contestant_1_id === contestant_2_id) {
      throw new Error('A slave cannot fight against himself');
    }
    if (contestant_1.status === Estado.Free || contestant_2.status === Estado.Free) {
      throw new Error('A free slave cannot participate in battles');
    }
    if (contestant_1.status === Estado.Escaped || contestant_2.status === Estado.Escaped) {
      throw new Error('An escaped slave cannot participate in battles');
    }

    // Determinar el ganador en función de fuerza + agilidad
    const contestant_1_score = contestant_1.strength + contestant_1.agility;
    const contestant_2_score = contestant_2.strength + contestant_2.agility;

    let winner_id: string;
    let loser: Esclavo;
    let winner: Esclavo;

    if (contestant_1_score > contestant_2_score) {
      winner_id = contestant_1.id;
      winner = contestant_1;
      loser = contestant_2;
    } else if (contestant_2_score > contestant_1_score) {
      winner_id = contestant_2.id;
      winner = contestant_2;
      loser = contestant_1;
    } else {
      throw new Error('The battle is a draw, no winner can be determined');
    }

    // PROBABILIDADES DE EVENTOS ESPECIALES
    const escapeProbability = 0.10;      // 10% escape milagroso
    const betrayalProbability = 0.07;    // 7% traición
    const random = Math.random();

    let miraculous_escape = false;
    let betrayal_occurred = false;
    let success = false;
    let death_occurred = false;
    let kills = 0;
    let injuries = "Fearsome fight with heavy wounds";

    if (random < escapeProbability) {
      // Escape milagroso
      miraculous_escape = true;
      success = false;
      death_occurred = false;
      kills = 0;
      injuries = "Uno de los concursantes escapó milagrosamente";
    } else if (random < escapeProbability + betrayalProbability) {
      // Traición
      betrayal_occurred = true;
      success = false;
      death_occurred = true;
      kills = 1;
      injuries = "Traición mortal en la arena!";
      // El perdedor muere por traición
      loser.status = Estado.Dead;
      loser.healthStatus = "Dead";
    } else {
      // Combate normal
      success = true;
      // Asignar victorias y derrotas
      winner.wins += 1;
      loser.losses += 1;

      // Lógica de degradación de healthStatus
      const healthProgression = {
        Healthy: "Injured",
        Injured: "Critical",
        Critical: "Dead",
      };

      // Si el perdedor ya estaba en "Critical", cambia a "Dead" y el estado pasa a Dead
      if (loser.healthStatus === "Critical") {
        loser.status = Estado.Dead;
        loser.healthStatus = "Dead";
        death_occurred = true;
        kills = 1;
      } else {
        loser.healthStatus = healthProgression[loser.healthStatus] || "Injured";
      }

      // El ganador también puede salir herido (pero no puede morir por ganar)
      if (winner.healthStatus === "Healthy" || winner.healthStatus === "Injured") {
        winner.healthStatus = "Injured";
      }
    }

    const queryRunner = this.BattleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Guardar cambios en los concursantes
      await queryRunner.manager.save(winner);
      await queryRunner.manager.save(loser);

      // Registrar la batalla con todos los datos relevantes
      const battle = this.BattleRepository.create({
        ...rest,
        organizer,
        contestant_1,
        contestant_2,
        name: createBattleDto.name,
        description: createBattleDto.description,
        winner_id,
        death_occurred,
        kills,
        injuries,
        betrayal_occurred,
        miraculous_escape,
        success,
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
    const battle = await this.BattleRepository.findOne({ where: { id }, relations: ['organizer', 'contestant_1', 'contestant_2'] });
    if (!battle) {
      throw new NotFoundException(`Battle with ID ${id} not found`);
    }
    return battle;
  }

  async update(id: string, updateBattleDto: CreateBattleDto): Promise<Battle> {
    const battle = await this.findOne(id);
    Object.assign(battle, updateBattleDto);
    return this.BattleRepository.save(battle);
  }

  async remove(id: string): Promise<void> {
    const battle = await this.findOne(id);
    await this.BattleRepository.remove(battle);
  }
}