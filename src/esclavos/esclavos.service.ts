import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEsclavoDto } from './dto/create-esclavo.dto';
import { UpdateEsclavoDto } from './dto/update-esclavo.dto';
import { Esclavo } from './entities/esclavo.entity';
import { DictadorsService } from 'src/dictators/dictadors.service';
@Injectable()
export class EsclavosService implements OnModuleInit {
  constructor(
    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
    private readonly dictadorsService: DictadorsService,
  ) {}

  async onModuleInit() {}

  private calculateRank(esclavo: Esclavo): string {
    if (esclavo.wins > 5 || esclavo.strength > 20) {
      return 'Killing Machine';
    } else if (esclavo.wins >= 2 && esclavo.strength >= 10) {
      return 'Mediocre Fighter';
    } else if (esclavo.wins === 0){
      return 'Fresh Meat';
    } else {
      return 'Coward';
    }
  }

  async create(createEsclavoDto: CreateEsclavoDto): Promise<Esclavo> {
    const esclavo = this.esclavoRepository.create(createEsclavoDto);
    const dictador = await this.dictadorsService.findOne(createEsclavoDto.dictadorId); // Use findOne method from DictadorsService
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${createEsclavoDto.dictadorId} not found`);
    }
    dictador.esclavos.push(esclavo);
    esclavo.dictador = dictador; 
    esclavo.rank = this.calculateRank(esclavo);
    
    return await this.esclavoRepository.save(esclavo);
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