import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBetDto } from './dto/create-dictador-bet.dto';
import { UpdateBetDto } from './dto/update-dictador-bet.dto';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Battle } from '../battles/entities/battle.entity';
import { Bet } from './entities/dictador-bet.entity';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
    @InjectRepository(Dictador)
    private readonly dictadorRepository: Repository<Dictador>,
    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
    @InjectRepository(Battle)
    private readonly battleRepository: Repository<Battle>,
  ) {}

  async create(createBetDto: CreateBetDto): Promise<Bet> {
    const { dictador_id, contestant_id, battle_id, amount } = createBetDto;

    // Validar que el monto de la apuesta sea positivo
    if (amount <= 0) {
      throw new BadRequestException('El monto de la apuesta debe ser mayor a 0.');
    }

    // Validar que el dictador exista
    const dictador = await this.dictadorRepository.findOne({ where: { id: dictador_id } });
    if (!dictador) {
      throw new NotFoundException(`Dictador con ID ${dictador_id} no encontrado.`);
    }
    
    if (dictador.loyalty_to_Carolina === 0) {
      throw new BadRequestException('Un dictador desleal no puede realizar apuestas.');
    }

    // Validar que el esclavo exista
    const contestant = await this.esclavoRepository.findOne({ where: { id: contestant_id } });
    if (!contestant) {
      throw new NotFoundException(`Esclavo con ID ${contestant_id} no encontrado.`);
    }

    // Validar que la batalla exista
    const battle = await this.battleRepository.findOne({ where: { id: battle_id } });
    if (!battle) {
      throw new NotFoundException(`Batalla con ID ${battle_id} no encontrada.`);
    }

    // Validar que la batalla ya tenga un ganador
    if (!battle.winner_id) {
      throw new BadRequestException('La batalla aún no tiene un ganador.');
    }

    // Determinar si la apuesta fue ganada o perdida
    const won = battle.winner_id === contestant_id;

    // Crear la apuesta
    const newBet = this.betRepository.create({
      dictador,
      contestant,
      battle,
      amount,
      won,
    });

    // Guardar la apuesta
    return this.betRepository.save(newBet);
  }

  async findAll(): Promise<Bet[]> {
    return this.betRepository.find({ relations: ['dictador', 'contestant', 'battle'] });
  }

  async findOne(id: string): Promise<Bet> {
    const bet = await this.betRepository.findOne({ where: { id }, relations: ['dictador', 'contestant', 'battle'] });
    if (!bet) {
      throw new NotFoundException(`Apuesta con ID ${id} no encontrada.`);
    }
    return bet;
  }

  async update(id: string, updateBetDto: UpdateBetDto): Promise<Bet> {
    const bet = await this.findOne(id);

    // Actualizar los valores de la apuesta
    Object.assign(bet, updateBetDto);

    // Guardar los cambios
    return this.betRepository.save(bet);
  }

  async remove(id: string): Promise<void> {
    const bet = await this.findOne(id);
    await this.betRepository.remove(bet);
  }
}
