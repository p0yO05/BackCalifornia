import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Dictador } from 'src/dictadors/entities/dictador.entity';

export enum TransactionStatus {
  Completed = 'Completed',
  Failed = 'Failed',
  Discovered = 'Discovered',
}

export enum TransactionType {
  SlaveToDictador = 'SlaveToDictador',
  DictadorToDictador = 'DictadorToDictador',
}

@Entity('black_market_transactions')
export class BlackMarketTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Esclavo, { nullable: true })
  @JoinColumn({ name: 'buyer_esclavo_id' }) // Relación opcional con Esclavo
  buyerEsclavo: Esclavo | null;

  @ManyToOne(() => Dictador, { nullable: true })
  @JoinColumn({ name: 'buyer_dictador_id' }) // Relación opcional con Dictador (comprador)
  buyerDictador: Dictador | null;

  @ManyToOne(() => Dictador, { nullable: true })
  @JoinColumn({ name: 'seller_dictador_id' }) // Relación opcional con Dictador (vendedor)
  sellerDictador: Dictador | null;

  @Column()
  item: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Monto con decimales
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType, // Enumeración del tipo de transacción
  })
  transactionType: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus, // Enumeración del estado de la transacción
    default: TransactionStatus.Completed,
  })
  status: TransactionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Marca de tiempo para la creación de la transacción
}