import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialEvent } from './entities/special-event.entity';
import { CreateSpecialEventDto } from './dto/create-special-event.dto';
import { UpdateSpecialEventResultDto } from './dto/update-special-eventresults.dto';
import { Dictador } from 'src/dictadors/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Injectable()
export class SpecialEventsService {
  constructor(
    @InjectRepository(SpecialEvent)
    private readonly specialEventRepository: Repository<SpecialEvent>,
    @InjectRepository(Dictador)
    private readonly dictadorRepository: Repository<Dictador>,
    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
  ) {}

  // Crear un nuevo evento
  async createEvent(createEventDto: CreateSpecialEventDto): Promise<SpecialEvent> {
    const { organizerId, participantIds, ...data } = createEventDto;

    const organizer = await this.dictadorRepository.findOne({ where: { id: organizerId } });
    if (!organizer) {
      throw new NotFoundException(`Dictador with ID ${organizerId} not found`);
    }

    const participants = await this.esclavoRepository.findByIds(participantIds);
    if (participants.length !== participantIds.length) {
      throw new NotFoundException('Some participants were not found');
    }

    const event = this.specialEventRepository.create({
      ...data,
      organizer,
      participants,
    });

    return this.specialEventRepository.save(event);
  }

  // Obtener todos los eventos
  async findAll(): Promise<SpecialEvent[]> {
    return this.specialEventRepository.find({ relations: ['organizer', 'participants'] });
  }

  // Obtener un evento específico, buscador de eventos basicamente
  async findOne(id: string): Promise<SpecialEvent> {
    const event = await this.specialEventRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  // Actualizar resultados.. para alterar lo verdaderamente sucedido
  async updateEventResults(id: string, updateDto: UpdateSpecialEventResultDto): Promise<SpecialEvent> {
    const event = await this.findOne(id);

    event.results = {
      ...event.results,
      ...updateDto,
    };

    return this.specialEventRepository.save(event);
  }

  // Eliminar un evento, porque o fue un desastre o fue pesimo
  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.specialEventRepository.remove(event);
  }
}