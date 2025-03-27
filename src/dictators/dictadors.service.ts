import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictadorDto } from './dto/create-dictador.dto';
import { UpdateDictadorDto } from './dto/update-dictador.dto';
import { Dictador } from './entities/dictador.entity';
import { classToPlain } from 'class-transformer';

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

  async findAll(): Promise<any> {
    const dictadors = await this.dictadorRepository.find({ relations: ['esclavos', 'Battles', 'transactionsAsBuyer', 'transactionsAsSeller'] });
    return dictadors.map(dictador => classToPlain(dictador));
  }

  async findOne(id: string): Promise<any> {
    const dictador = await this.dictadorRepository.findOne({ where: { id }, relations: ['esclavos', 'Battles', 'transactionsAsBuyer', 'transactionsAsSeller'] });
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${id} not found`);
    }
    return classToPlain(dictador);
  }

  async update(id: string, updateDictadorDto: UpdateDictadorDto): Promise<any> {
    const dictador = await this.findOne(id);
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${id} not found`);
    }
    Object.assign(dictador, updateDictadorDto);
    const updatedDictador = await this.dictadorRepository.save(dictador);
    return classToPlain(updatedDictador);
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
