import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Estado } from './estado.enum';
import { IsInt, IsString, IsEnum, Min, Max } from 'class-validator';
import { Dictador } from 'src/dictators/entities/dictador.entity';
import { Battle } from 'src/battles/entities/battle.entity'; // Import Battle entity

@Entity()
export class Esclavo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  nickname: string;

  @Column()
  @IsString()
  origin: string;

  @Column()
  @IsInt()
  @Min(1)
  @Max(100)
  strength: number;

  @Column()
  @IsInt()
  @Min(1)
  @Max(100)
  agility: number;

  @Column()
  @IsInt()
  wins: number;

  @Column()
  @IsInt()
  losses: number;

  @Column({
    type: 'enum',
    enum: Estado,
  })
  @IsEnum(Estado)
  status: Estado;

  @Column()
  @IsString()
  healthStatus: string;

  @Column()
  @IsString()
  rank: string;

  @ManyToOne(() => Dictador, dictador => dictador.esclavos)
  dictador: Dictador;

  @OneToMany(() => Battle, battle => battle.contestant_1)
  battlesAsContentant1: Battle[];
  
  @OneToMany(() => Battle, battle => battle.contestant_2)
  battlesAsContestants2: Battle[];
}