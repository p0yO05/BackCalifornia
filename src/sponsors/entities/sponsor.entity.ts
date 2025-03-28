import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,CreateDateColumn, OneToMany} from 'typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';

  
  @Entity('sponsors')
  export class Sponsor {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    company_name: string; // Nombre malevolo (doofenshmirtz malvados y asociados)
  
    @Column('text')
    donated_items: string; // Equipo y Buffs Donados
  
    @ManyToOne(() => Esclavo, { nullable: true }) // jugador favorito, campeon corporativo
    preferred_fighter: Esclavo;
  
    @CreateDateColumn()
    createdAt: Date; // Fecha de registro del sponsor

  
  }
  