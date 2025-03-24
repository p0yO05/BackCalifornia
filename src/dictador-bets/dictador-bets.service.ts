import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBetDto } from './dto/create-dictador-bet.dto';
import { UpdateBetDto } from './dto/create-dictador-bet.dto';
import { Dictador } from '../dictadors/entities/dictador.entity';
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

    const dictador = await this.dictadorRepository.findOne({ where: { id: dictador_id } });
    if (!dictador) {
      throw new NotFoundException(`El DICtador de id ${dictador_id} No esta para "Compartir sus Riquezas" con Carolina`);
    }

    const contestant = await this.esclavoRepository.findOne({ where: { id: contestant_id } });
    if (!contestant) {
      throw new NotFoundException(`That guy with the id ${contestant_id} is not on the list. choose someone else Comrade`);
    }

    const battle = await this.battleRepository.findOne({ where: { id: battle_id } });
    if (!battle) {
      throw new NotFoundException(`The Battle with the id ${battle_id} Hasnt been scheduled yet`);
    }

    const newBet = this.betRepository.create({
      dictador,
      contestant,
      battle,
      amount,
    });

    return this.betRepository.save(newBet);
  }

  async findAll(): Promise<Bet[]> {
    return this.betRepository.find();
  }

  async findOne(id: string): Promise<Bet> {
    const bet = await this.betRepository.findOne({ where: { id } });
    if (!bet) {
      throw new NotFoundException(`Bet with ID ${id} not found`);
    }
    return bet;
  }

  async update(id: string, updateBetDto: UpdateBetDto): Promise<Bet> {
    const bet = await this.findOne(id);

    Object.assign(bet, updateBetDto);

    return this.betRepository.save(bet);
  }

  async remove(id: string): Promise<void> {
    const bet = await this.findOne(id);
    await this.betRepository.remove(bet);
  }
}
