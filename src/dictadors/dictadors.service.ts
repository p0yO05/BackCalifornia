import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictadorDto } from './dto/create-dictador.dto';
import { UpdateDictadorDto } from './dto/update-dictador.dto';
import { Dictador } from './entities/dictador.entity';

@Injectable()
export class DictadorsService {
  constructor(
    @InjectRepository(Dictador)
    private readonly dictadorRepository: Repository<Dictador>,
  ) {}

  create(createDictadorDto: CreateDictadorDto): Promise<Dictador> {
    const dictador = this.dictadorRepository.create(createDictadorDto);
    return this.dictadorRepository.save(dictador);
  }

  findAll(): Promise<Dictador[]> {
    return this.dictadorRepository.find({ relations: ['esclavos', 'specialEvents', 'transactionsAsBuyer', 'transactionsAsSeller'] });
  }

  findOne(id: string): Promise<Dictador | null> {
    const dictador = this.dictadorRepository.findOne({ where: { id }, relations: ['esclavos', 'specialEvents', 'transactionsAsBuyer', 'transactionsAsSeller'] });
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${id} not found`);
    }
    return dictador;
  }

  async update(id: string, updateDictadorDto: UpdateDictadorDto): Promise<Dictador | null> {
    const dictador = await this.findOne(id);
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${id} not found`);
    }
    Object.assign(dictador, updateDictadorDto);
    return this.dictadorRepository.save(dictador);
  }

  async remove(id: string): Promise<boolean> {
    const dictador = await this.findOne(id);
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${id} not found`);
    }
    await this.dictadorRepository.remove(dictador);
    return true;
  }
}




