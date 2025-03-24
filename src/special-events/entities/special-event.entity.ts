  import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,ManyToMany,JoinTable,CreateDateColumn,} from 'typeorm';
  import { Dictador } from 'src/dictadors/entities/dictador.entity';
  import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
  
  @Entity('special_events')
  export class SpecialEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    name: string; // Nombre del evento
  
    @Column('text', { nullable: true })
    description: string; // Descripción del evento
  
    @ManyToOne(() => Dictador, (dictador) => dictador.specialEvents)
    organizer: Dictador; // Dictador organizador del evento
  
    @ManyToMany(() => Esclavo)
    @JoinTable()
    participants: Esclavo[]; // Lista de esclavos participantes
  
    @Column({ type: 'json', nullable: true })
    results: { winner?: string; casualties?: number; notableMoments?: string[] }; // Resultados del evento
  
    @Column({ type: 'boolean', default: false })
    success: boolean; // Indicador de éxito del evento
  
    @CreateDateColumn()
    createdAt: Date; // Fecha de creación del evento
  }