import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { BlackMarketTransaction } from 'src/blackmarket/entities/blackmarket.entity';
import { IsInt, IsString, IsUUID, Min, Max } from 'class-validator';
import { Expose } from 'class-transformer';
import { Battle } from 'src/battles/entities/battle.entity';
import { Dictadorlog } from 'src/dictadorlog/entities/dictadorlog.entity';

@Entity('Dictadors')
export class Dictador {

  @OneToOne(() => Dictadorlog, (dictadorlog) => dictadorlog.dictador)
  dictadorlog: Dictadorlog;

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  territory: string;

  @Column()
  @IsInt()
  @Min(1)
  @Max(100)
  loyalty_to_Carolina: number;

  @Expose()
  get number_of_slaves(): number 

  {
    return this.esclavos ? this.esclavos.length : 0;
    
  }

  @OneToMany(() => Esclavo, (esclavo) => esclavo.dictador)
  esclavos: Esclavo[];

  @OneToMany(() => Battle, (Battle) => Battle.organizer)
  Battles: Battle[];

  @OneToMany(() => BlackMarketTransaction, (transaction) => transaction.buyerDictador)
  transactionsAsBuyer: BlackMarketTransaction[];

  @OneToMany(() => BlackMarketTransaction, (transaction) => transaction.sellerDictador)
  transactionsAsSeller: BlackMarketTransaction[];

  @Column('text', { default: 'Dictador' })
  rol?: string;

  @BeforeInsert()
  nameToUpperCase() {
    this.name = this.name.toUpperCase();
  }

}