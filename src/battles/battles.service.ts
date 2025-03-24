import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Battle } from './entities/battle.entity';
import { Repository } from 'typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Injectable()
export class BattleService {
  constructor(
    @InjectRepository(Battle)
    private readonly battleRepository: Repository<Battle>,

    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>, // Repositorio de Esclavos
  ) {}

  // Crear una nueva batalla
  async create(createBattleDto: CreateBattleDto): Promise<Battle> {
    const { contestant_1, contestant_2, ...rest } = createBattleDto;

    // Validar que los concursantes existen
    const firstContestant = await this.esclavoRepository.findOne({ where: { id: contestant_1 } });
    if (!firstContestant) {
      throw new NotFoundException(`Contestant with ID ${contestant_1} does not exist`);
    }

    const secondContestant = await this.esclavoRepository.findOne({ where: { id: contestant_2 } });
    if (!secondContestant) {
      throw new NotFoundException(`Contestant with ID ${contestant_2} does not exist`);
    }

    // Crear la batalla
    const newBattle = this.battleRepository.create({
      contestant_1: firstContestant,
      contestant_2: secondContestant,
      ...rest, // Estadísticas iniciales opcionales
    });

    return this.battleRepository.save(newBattle);
  }

  // Obtener todas las batallas (incluyendo relaciones)
  async findAll(): Promise<Battle[]> {
    return this.battleRepository.find({
      relations: ['contestant_1', 'contestant_2', 'winner'], // Incluir relaciones con entidad
    });
  }

  // Obtener una batalla específica (incluyendo relaciones)
  async findOne(id: string): Promise<Battle> {
    const battle = await this.battleRepository.findOne({
      where: { id },
      relations: ['contestant_1', 'contestant_2', 'winner'], // Incluir relaciones
    });

    if (!battle) {
      throw new NotFoundException(`Oh Comrade This Battle with id ${id} was not done`);
    }

    return battle;
  }

  // Actualizar una batalla (incluyendo estadísticas)
  async update(id: string, updateBattleDto: UpdateBattleDto): Promise<Battle> {
    const battle = await this.findOne(id);

    if (!battle) {
      throw new NotFoundException(`Battle with ID ${id} not found`);
    }

    // Actualizar solo los campos válidos
    Object.assign(battle, updateBattleDto);

    return this.battleRepository.save(battle);
  }

  // Eliminar una batalla.. esta no paso Camarada
  async remove(id: string): Promise<void> {
    const battle = await this.findOne(id);
    await this.battleRepository.remove(battle);
  }
}