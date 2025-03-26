import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Entity('special_events')
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string; // Nombre del evento

  @Column('text', { nullable: true })
  description: string; // Descripción del evento

  @ManyToOne(() => Dictador, (dictador) => dictador.Battles)
  organizer: Dictador; // Dictador organizador del evento

  @ManyToOne(() => Esclavo, { nullable: true }) // Primer luchador
  @JoinColumn({ name: 'contestant_1_id' })
  contestant_1: Esclavo;

  @ManyToOne(() => Esclavo, { nullable: true }) // Segundo luchador
  @JoinColumn({ name: 'contestant_2_id' })
  contestant_2: Esclavo;

  @Column({ type: 'uuid', nullable: true }) // Puede ser null si no gana nadie
  winner_id: string;

  @Column({ type: 'boolean', default: false })
  death_occurred: boolean; // Indica si alguien murió

  @Column({ type: 'int', default: 0 })
  kills: number; // Número de muertes en el combate

  @Column({ type: 'text', nullable: true })
  injuries: string; // Descripción de las lesiones

  @Column({ type: 'boolean', default: false })
  betrayal_occurred: boolean; // Indica si ocurrió una traición

  @Column({ type: 'boolean', default: false })
  miraculous_escape: boolean; // Indica si ocurrió un escape milagroso

  @Column({ type: 'json', nullable: true })
  results: { winner?: string; casualties?: number; notableMoments?: string[] }; // Resultados del evento

  @Column({ type: 'boolean', default: false })
  success: boolean; // Indicador de éxito del evento

  @CreateDateColumn()
  createdAt: Date; // Fecha de creación del evento
}