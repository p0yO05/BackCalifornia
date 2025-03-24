import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

@Entity('battles')
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Esclavo , { nullable: true }) // primer luchador
  @JoinColumn({ name: 'Peleador a mi derecha' })
  contestant_1: Esclavo;                            // el dictador nunca pelea, domina y manda

  @ManyToOne(() => Esclavo, { nullable: true }) //  segundo luchador
  @JoinColumn({ name: 'Peleador a mi otra derecha' })
  contestant_2: Esclavo;

  @Column({ type: 'uuid', nullable: true }) // puede ser null si no gana nadie
  winner_id: string;

  @Column({ type: 'boolean', default: false })
  death_occurred: boolean; // Indica si alguien murió

  @Column({ type: 'int', default: 0 })
  kills: number;  // numero de muertes en el combate

  @Column({ type: 'text', nullable: true })
  injuries: string; // curitas para todos

  @Column({ type: 'boolean', default: false })
  betrayal_occurred: boolean; // betrayal, lost the lead

  @Column({ type: 'boolean', default: false })
  miraculous_escape: boolean; // escape milagroso? huh.. interesante

  @CreateDateColumn()
  date: Date; // Fecha de la batalla (se genera automáticamente)
}
