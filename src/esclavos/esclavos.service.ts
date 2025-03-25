import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEsclavoDto } from './dto/create-esclavo.dto';
import { UpdateEsclavoDto } from './dto/update-esclavo.dto';
import { Esclavo } from './entities/esclavo.entity';
import { Estado } from './entities/estado.enum';

@Injectable()
export class EsclavosService implements OnModuleInit {
  constructor(
    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
  ) {}

  async onModuleInit() {
   // await this.initializeData();
  }

/*private async initializeData() {
    const count = await this.esclavoRepository.count();
    if (count === 0) {
      const initialEsclavos: CreateEsclavoDto[] = [
        {
          name: 'Luis Miguiel',
          nickname: 'EL Muerto de Hambre',
          origin: 'Venezuela',
          strength: 10,
          agility: 10,
          wins: 0,
          losses: 0,
          status: Estado.Alive,
          healthStatus: 'Healthy',
        },
        {
          name: 'Alejandro Mendoza',
          nickname: 'El T 3énis',
          origin: 'México',
          strength: 12,
          agility: 8,
          wins: 15,
          losses: 3,
          status: Estado.Alive,
          healthStatus: 'Injured',
        },
        {
          name: 'Valeria Torres',
          nickname: 'Llama Dorada',
          origin: 'Chile',
          strength: 11,
          agility: 9,
          wins: 14,
          losses: 4,
          status: Estado.Alive,
          healthStatus: 'Healthy',
        },
        {
          name: 'Rafael Guzmán',
          nickname: 'Espíritu de Jaguar',
          origin: 'Colombia',
          strength: 10,
          agility: 11,
          wins: 18,
          losses: 2,
          status: Estado.Alive,
          healthStatus: 'Healthy',
        },
        {
          name: 'Diego Vargas',
          nickname: 'El Relámpago',
          origin: 'Argentina',
          strength: 9,
          agility: 13,
          wins: 20,
          losses: 1,
          status: Estado.Alive,
          healthStatus: 'Healthy',
        },
        {
          name: 'Lucía Díaz',
          nickname: 'Sombra Nocturna',
          origin: 'Venezuela',
          strength: 10,
          agility: 12,
          wins: 16,
          losses: 5,
          status: Estado.Alive,
          healthStatus: 'Injured',
        },
      ];

      for (const esclavoDto of initialEsclavos) {
        const esclavo = this.esclavoRepository.create(esclavoDto);
        esclavo.rank = this.calculateRank(esclavo);
        await this.esclavoRepository.save(esclavo);
      }
    }
  }*/

  private calculateRank(esclavo: Esclavo): string {
    if (esclavo.wins > 5 || esclavo.strength > 20) {
      return 'Killing Machine';
    } else if (esclavo.wins >= 2 && esclavo.strength >= 10) {
      return 'Mediocre Fighter';
    } else {
      return 'Coward';
    }
  }

  async create(createEsclavoDto: CreateEsclavoDto): Promise<Esclavo> {
    const esclavo = this.esclavoRepository.create(createEsclavoDto);
    esclavo.rank = this.calculateRank(esclavo);
    return this.esclavoRepository.save(esclavo);
  }

  async findAll(): Promise<Esclavo[]> {
    return this.esclavoRepository.find();
  }

  async findOne(id: string): Promise<Esclavo> {
    return this.findEsclavoById(id);
  }

  private async findEsclavoById(id: string): Promise<Esclavo> {
    const esclavo = await this.esclavoRepository.findOne({ where: { id } });
    if (!esclavo) {
      throw new NotFoundException(`Slave with ID ${id} not found`);
    }
    return esclavo;
  }

  async update(id: string, updateEsclavoDto: UpdateEsclavoDto): Promise<Esclavo> {
    const esclavo = await this.findEsclavoById(id);
    Object.assign(esclavo, updateEsclavoDto);
    esclavo.rank = this.calculateRank(esclavo);
    return this.esclavoRepository.save(esclavo);
  }

  async remove(id: string): Promise<void> {
    const esclavo = await this.findEsclavoById(id);
    await this.esclavoRepository.delete(id);
  }
}