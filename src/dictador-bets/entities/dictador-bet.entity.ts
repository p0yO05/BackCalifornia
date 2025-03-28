import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Battle } from 'src/battles/entities/battle.entity';

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Dictador, { eager: true })
  @JoinColumn({ name: 'dictador_id' })
  dictador: Dictador;

  @ManyToOne(() => Esclavo, { eager: true })
  @JoinColumn({ name: 'contestant_id' })
  contestant: Esclavo;

  @ManyToOne(() => Battle, { eager: true })
  @JoinColumn({ name: 'battle_id' })
  battle: Battle;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'boolean', nullable: true })
  won: boolean; // Indica si la apuesta fue ganada o perdida
}
