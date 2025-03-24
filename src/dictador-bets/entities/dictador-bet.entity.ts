import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,
  } from 'typeorm';
  import { Dictador } from 'src/dictadors/entities/dictador.entity';
  import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
  import { Battle } from 'src/battles/entities/battle.entity';
  
  @Entity('bets')
  export class Bet {
    @PrimaryGeneratedColumn('uuid')
    id: string; 
  
    @ManyToOne(() => Dictador, { eager: true })
    @JoinColumn({ name: 'dictador_id' })
    dictador: Dictador; // Dictador que realiza la apuesta
  
    @ManyToOne(() => Esclavo, { eager: true })
    @JoinColumn({ name: 'contestant_id' })
    contestant: Esclavo; // Esclavo por el que se apuesta
  
    @ManyToOne(() => Battle, { eager: true })
    @JoinColumn({ name: 'battle_id' })
    battle: Battle; // Batalla en la que se realiza la apuesta
  
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number; // Cantidad de la apuesta
  
    @Column({ type: 'boolean', nullable: true })
    won: boolean; // Indica si ganó la apuesta, bai bai dinero de impuestos
  }
  