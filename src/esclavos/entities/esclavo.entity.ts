import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Estado } from './estado.enum';
import { IsInt, IsString, IsEnum, Min, Max } from 'class-validator';
import { Dictador } from 'src/dictators/entities/dictador.entity';
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



}