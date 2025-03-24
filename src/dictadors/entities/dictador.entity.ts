import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { SpecialEvent } from 'src/special-events/entities/special-event.entity';
import { BlackMarketTransaction } from 'src/blackmarket/entities/blackmarket.entity';
import { IsInt, IsString, IsUUID, Min, Max } from 'class-validator';

@Entity('Dictadors')
export class Dictador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  territory: string;

  @Column()
  @IsInt()
  @Min(0)
  number_of_slaves: number;

  @Column()
  @IsInt()
  @Min(1)
  @Max(100)
  loyalty_to_Carolina: number;

  @OneToMany(() => Esclavo, (esclavo) => esclavo.dictador)
  esclavos: Esclavo[];

  @OneToMany(() => SpecialEvent, (specialEvent) => specialEvent.organizer)
  specialEvents: SpecialEvent[];

  @OneToMany(() => BlackMarketTransaction, (transaction) => transaction.buyerDictador)
  transactionsAsBuyer: BlackMarketTransaction[];

  @OneToMany(() => BlackMarketTransaction, (transaction) => transaction.sellerDictador)
  transactionsAsSeller: BlackMarketTransaction[];

  @BeforeInsert()
  nameToUpperCase() {
    this.name = this.name.toUpperCase();
  }
}