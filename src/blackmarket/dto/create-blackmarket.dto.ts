import { IsNotEmpty, IsUUID, IsString, IsNumber, Min, IsEnum, ValidateIf } from 'class-validator';
import { TransactionStatus, TransactionType } from '../entities/blackmarket.entity';

export class CreateBlackmarketDto {
  @IsNotEmpty()
  @IsUUID()
  @ValidateIf((obj) => obj.transactionType === TransactionType.SlaveToDictador)
  buyerEsclavoId?: string; // ID del comprador esclavo (opcional)

  @IsNotEmpty()
  @IsUUID()
  @ValidateIf((obj) => obj.transactionType === TransactionType.DictadorToDictador)
  buyerDictadorId?: string; // ID del comprador dictador (opcional)

  @IsNotEmpty()
  @IsUUID()
  sellerId: string; // ID del vendedor (dictador)

  @IsNotEmpty()
  @IsString()
  item: string; // Ítem de la transacción

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number; // Monto de la transacción

  @IsNotEmpty()
  @IsEnum(TransactionType)
  transactionType: TransactionType; // Tipo de transacción

  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus; // Estado de la transacción
}