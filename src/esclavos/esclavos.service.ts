import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEsclavoDto } from './dto/create-esclavo.dto';
import { UpdateEsclavoDto } from './dto/update-esclavo.dto';
import { Esclavo } from './entities/esclavo.entity';
import { DictadorsService } from 'src/dictators/dictadors.service';
import { instanceToPlain } from 'class-transformer';

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
    } else if (esclavo.wins === 0) {
      return 'Fresh Meat';
    } else {
      return 'Coward';
    }
  }

  async create(createEsclavoDto: CreateEsclavoDto): Promise<any> {
    const { name, nickname, origin, dictadorId, status } = createEsclavoDto;

    // Verificar que el dictador existe
    const dictador = await this.dictadorsService.findOne(dictadorId);
    if (!dictador) {
      throw new NotFoundException(`Dictador con ID ${dictadorId} no encontrado.`);
    }

    // Validar que `status` sea válido
    const STATUS_MAP = ["Alive", "Dead", "Escaped for now", "Has been set Free"];
    if (!STATUS_MAP.includes(status)) {
      throw new BadRequestException(`El status '${status}' no es válido. Debe ser uno de: ${STATUS_MAP.join(", ")}`);
    }

    // Crear esclavo con valores por defecto
    const newEsclavo = this.esclavoRepository.create({
      name,
      nickname,
      origin,
      strength: createEsclavoDto.strength ?? 10,
      agility: createEsclavoDto.agility ?? 10,
      status,
      wins: createEsclavoDto.wins ?? 0,
      losses: createEsclavoDto.losses ?? 0,
      healthStatus: createEsclavoDto.healthStatus ?? "Healthy",
      dictador,
    });

    newEsclavo.rank = this.calculateRank(newEsclavo);

    await this.esclavoRepository.save(newEsclavo);

    return instanceToPlain(newEsclavo); // 🔥 Evita referencias circulares al devolver el esclavo
  }

  async findAll(): Promise<any[]> {
    const esclavos = await this.esclavoRepository.find({ relations: ['dictador'] });
    return esclavos.map(esclavo => instanceToPlain(esclavo)); // 🔥 Limpia datos antes de enviarlos
  }

  async findOne(id: string): Promise<any> {
    const esclavo = await this.esclavoRepository.findOne({ where: { id }, relations: ['dictador'] });
    if (!esclavo) {
      throw new NotFoundException(`Esclavo con ID ${id} no encontrado.`);
    }

    return instanceToPlain(esclavo);
  }

  async update(id: string, updateEsclavoDto: UpdateEsclavoDto): Promise<any> {
    const esclavo = await this.findOne(id);
    const { dictadorId, ...rest } = updateEsclavoDto;

    if (dictadorId) {
      const dictador = await this.dictadorsService.findOne(dictadorId);
      if (!dictador) {
        throw new NotFoundException(`Dictador con ID ${dictadorId} no encontrado.`);
      }
      esclavo.dictador = dictador;
    }

    Object.assign(esclavo, rest);
    esclavo.rank = this.calculateRank(esclavo);

    await this.esclavoRepository.save(esclavo);
    return instanceToPlain(esclavo);
  }

  async remove(id: string): Promise<void> {
    const esclavo = await this.findOne(id);
    await this.esclavoRepository.delete(id);
  }
}