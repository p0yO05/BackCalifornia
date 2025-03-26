import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Dictador } from 'src/dictators/entities/dictador.entity';
@Entity()
export class Dictadorlog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Dictador)
    @JoinColumn()
    dictador: Dictador;

    @Column('text',{ default: 'Dictador' })
    rol?: string;
}