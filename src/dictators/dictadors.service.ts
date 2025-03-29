import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictadorDto } from './dto/create-dictador.dto';
import { UpdateDictadorDto } from './dto/update-dictador.dto';
import { Dictador } from './entities/dictador.entity';
import { instanceToPlain } from 'class-transformer';

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
    
    // Aplicar penalización de lealtad para dictadores con más de 10 esclavos
    const updatedDictadors = dictadors.map((dictador) => {
      if (dictador.esclavos.length > 10) {
        const extraSlavePenaltyFactor = 3; // Penalización de 3 puntos por esclavo adicional
        const penalty = (dictador.esclavos.length - 10) * extraSlavePenaltyFactor;
        dictador.loyalty_to_Carolina = Math.max(0, dictador.loyalty_to_Carolina - penalty); // Asegurarse de que no sea negativo
      }
      return dictador;
    });

    return updatedDictadors.map(dictador => instanceToPlain(dictador));
  }

  async findOne(id: string): Promise<any> {
    const dictador = await this.dictadorRepository.findOne({ where: { id }, relations: ['esclavos', 'Battles', 'transactionsAsBuyer', 'transactionsAsSeller'] });
    
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${id} not found`);
    }

    // Aplicar penalización de lealtad para dictadores con más de 10 esclavos
    if (dictador.esclavos.length > 10) {
      const extraSlavePenaltyFactor = 3; // Penalización de 3 puntos por esclavo adicional
      const penalty = (dictador.esclavos.length - 10) * extraSlavePenaltyFactor;
      dictador.loyalty_to_Carolina = Math.max(0, dictador.loyalty_to_Carolina - penalty); // Asegurarse de que no sea negativo
    }

    return instanceToPlain(dictador);
  }

  async update(id: string, updateDictadorDto: UpdateDictadorDto): Promise<any> {
    const dictador = await this.findOne(id);
    if (!dictador) {
      throw new NotFoundException(`Dictador with ID ${id} not found`);
    }
    Object.assign(dictador, updateDictadorDto);

    // Aplicar penalización de lealtad para dictadores con más de 10 esclavos
    if (dictador.esclavos.length > 10) {
      const extraSlavePenaltyFactor = 3; // Penalización de 3 puntos por esclavo adicional
      const penalty = (dictador.esclavos.length - 10) * extraSlavePenaltyFactor;
      dictador.loyalty_to_Carolina = Math.max(0, dictador.loyalty_to_Carolina - penalty); // Asegurarse de que no sea negativo
    }

    const updatedDictador = await this.dictadorRepository.save(dictador);
    return instanceToPlain(updatedDictador);
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
