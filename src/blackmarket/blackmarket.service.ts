import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlackmarketDto } from './dto/create-blackmarket.dto';
import { UpdateBlackmarketDto } from './dto/update-blackmarket.dto';
import { BlackMarketTransaction, TransactionStatus, TransactionType } from './entities/blackmarket.entity';
import { Esclavo } from 'src/esclavos/entities/esclavo.entity';
import { Dictador } from 'src/dictadors/entities/dictador.entity';

@Injectable()
export class BlackmarketService {
  constructor(
    @InjectRepository(BlackMarketTransaction)
    private readonly blackMarketRepository: Repository<BlackMarketTransaction>,
    @InjectRepository(Esclavo)
    private readonly esclavoRepository: Repository<Esclavo>,
    @InjectRepository(Dictador)
    private readonly dictadorRepository: Repository<Dictador>,
  ) {}

  // Crear una transacción en el mercado negro
  async create(createBlackmarketDto: CreateBlackmarketDto): Promise<BlackMarketTransaction> {
    const { buyerId, sellerId, transactionType, item, amount } = createBlackmarketDto;
  
    // Validar que el monto sea válido
    if (amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor a 0.');
    }
  
    // Variables para las relaciones
    let buyerEsclavo: Esclavo | null = null;
    let buyerDictador: Dictador | null = null;
    let sellerDictador: Dictador | null = null;
  
    // Cargar relaciones según el tipo de transacción
    if (transactionType === TransactionType.SlaveToDictador) {
      // Buscar Esclavo como comprador
      buyerEsclavo = await this.esclavoRepository.findOne({ where: { id: buyerId } });
      if (!buyerEsclavo) {
        throw new NotFoundException(`Esclavo con ID ${buyerId} no encontrado.`);
      }
  
      // Buscar Dictador como vendedor
      sellerDictador = await this.dictadorRepository.findOne({ where: { id: sellerId } });
      if (!sellerDictador) {
        throw new NotFoundException(`Dictador con ID ${sellerId} no encontrado.`);
      }
    } else if (transactionType === TransactionType.DictadorToDictador) {
      // Buscar Dictador como comprador
      buyerDictador = await this.dictadorRepository.findOne({ where: { id: buyerId } });
      if (!buyerDictador) {
        throw new NotFoundException(`Dictador comprador con ID ${buyerId} no encontrado.`);
      }
  
      // Buscar Dictador como vendedor
      sellerDictador = await this.dictadorRepository.findOne({ where: { id: sellerId } });
      if (!sellerDictador) {
        throw new NotFoundException(`Dictador vendedor con ID ${sellerId} no encontrado.`);
      }
    } else {
      throw new BadRequestException('Tipo de transacción no válido.');
    }
  
    // Crear instancia de la transacción
    const newTransaction = new BlackMarketTransaction();
    newTransaction.buyerEsclavo = buyerEsclavo; // Puede ser null
    newTransaction.buyerDictador = buyerDictador; // Puede ser null
    newTransaction.sellerDictador = sellerDictador; // Puede ser null
    newTransaction.item = item;
    newTransaction.amount = amount;
    newTransaction.transactionType = transactionType;
    newTransaction.status = TransactionStatus.Completed;
  
    // Guardar la transacción
    return await this.blackMarketRepository.save(newTransaction);
  }
  // Obtener todas las transacciones
  async findAll(): Promise<BlackMarketTransaction[]> {
    return this.blackMarketRepository.find({
      relations: ['buyerEsclavo', 'buyerDictador', 'sellerDictador'],
    });
  }

  // Obtener transacciones asociadas a un dictador
  async findTransactionsByDictador(dictadorId: string): Promise<BlackMarketTransaction[]> {
    return this.blackMarketRepository.find({
      where: [
        { buyerDictador: { id: dictadorId } },
        { sellerDictador: { id: dictadorId } },
      ],
      relations: ['buyerDictador', 'sellerDictador'],
    });
  }

  // Buscar una transacción específica por ID
  async findOne(id: string): Promise<BlackMarketTransaction> {
    const transaction = await this.blackMarketRepository.findOne({
      where: { id },
      relations: ['buyerEsclavo', 'buyerDictador', 'sellerDictador'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada.`);
    }

    return transaction;
  }

  // Actualizar una transacción existente
  async update(
    id: string,
    updateBlackmarketDto: UpdateBlackmarketDto,
  ): Promise<BlackMarketTransaction> {
    const transaction = await this.blackMarketRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada.`);
    }

    Object.assign(transaction, updateBlackmarketDto);

    return this.blackMarketRepository.save(transaction);
  }

  // Eliminar una transacción por ID
  async remove(id: string): Promise<void> {
    const transaction = await this.blackMarketRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new NotFoundException(`Transacción con ID ${id} no encontrada.`);
    }

    await this.blackMarketRepository.delete(id);
  }
}