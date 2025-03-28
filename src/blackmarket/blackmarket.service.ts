import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateBlackmarketDto } from './dto/create-blackmarket.dto';
import { UpdateBlackmarketDto } from './dto/update-blackmarket.dto';
import { BlackMarketTransaction, TransactionStatus, TransactionType } from './entities/blackmarket.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Dictador } from 'src/dictators/entities/dictador.entity';

@Injectable()
export class BlackmarketService {
  constructor(
    @InjectRepository(BlackMarketTransaction)
    private readonly blackMarketRepository: Repository<BlackMarketTransaction>,
    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
    @InjectRepository(Dictador)
    private readonly dictadorRepository: Repository<Dictador>,
    private readonly dataSource: DataSource, // Inject the DataSource for transactions
  ) {}

  async create(createBlackmarketDto: CreateBlackmarketDto): Promise<BlackMarketTransaction> {
    const { buyerEsclavoId, buyerDictadorId, sellerId, transactionType, item, amount } = createBlackmarketDto;

    if (amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let buyerEsclavo: Esclavo | null = null;
      let buyerDictador: Dictador | null = null;
      let sellerDictador: Dictador | null = null;

      if (transactionType === TransactionType.SlaveToDictador) {
        if (!buyerEsclavoId) {
          throw new BadRequestException('El ID del esclavo comprador es obligatorio para este tipo de transacción.');
        }
        buyerEsclavo = await queryRunner.manager.findOne(Esclavo, { where: { id: buyerEsclavoId } });
        if (!buyerEsclavo) {
          throw new NotFoundException(`Esclavo con ID ${buyerEsclavoId} no encontrado.`);
        }

        sellerDictador = await queryRunner.manager.findOne(Dictador, { where: { id: sellerId } });
        if (!sellerDictador) {
          throw new NotFoundException(`Dictador con ID ${sellerId} no encontrado.`);
        }

        // Actualizar estadísticas del esclavo
        const agilityBuff = Math.round(Math.random() * 100);
        const strengthBuff = Math.round(Math.random() * 100);
        buyerEsclavo.strength = Math.min(100, strengthBuff + buyerEsclavo.strength);
        buyerEsclavo.agility = Math.min(100, agilityBuff + buyerEsclavo.agility);

        await queryRunner.manager.save(buyerEsclavo);
      } else if (transactionType === TransactionType.DictadorToDictador) {
        if (!buyerDictadorId) {
          throw new BadRequestException('El ID del dictador comprador es obligatorio para este tipo de transacción.');
        }
        buyerDictador = await queryRunner.manager.findOne(Dictador, { where: { id: buyerDictadorId } });
        if (!buyerDictador) {
          throw new NotFoundException(`Dictador comprador con ID ${buyerDictadorId} no encontrado.`);
        }

        sellerDictador = await queryRunner.manager.findOne(Dictador, { where: { id: sellerId } });
        if (!sellerDictador) {
          throw new NotFoundException(`Dictador vendedor con ID ${sellerId} no encontrado.`);
        }

        // Cambiar el dictador propietario del esclavo
        const esclavo = await queryRunner.manager.findOne(Esclavo, { where: { id: item } });
        if (!esclavo) {
          throw new NotFoundException(`Esclavo con ID ${item} no encontrado.`);
        }
        esclavo.dictador = buyerDictador;
        await queryRunner.manager.save(esclavo);
      } else {
        throw new BadRequestException('Tipo de transacción no válido.');
      }

      const newTransaction = new BlackMarketTransaction();
      newTransaction.buyerEsclavo = buyerEsclavo;
      newTransaction.buyerDictador = buyerDictador;
      newTransaction.sellerDictador = sellerDictador;
      newTransaction.item = item;
      newTransaction.amount = amount;
      newTransaction.transactionType = transactionType;
      newTransaction.status = TransactionStatus.Completed;

      buyerDictador?.transactionsAsBuyer.push(newTransaction);
      sellerDictador?.transactionsAsSeller.push(newTransaction);

      const savedTransaction = await queryRunner.manager.save(newTransaction);

      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<BlackMarketTransaction[]> {
    return this.blackMarketRepository.find({
      relations: ['buyerEsclavo', 'buyerDictador', 'sellerDictador'],
    });
  }
}