import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { IsOptional, IsBoolean } from 'class-validator';

export class CreateBetDto {
  @IsNotEmpty()
  @IsUUID()
  dictador_id: string;

  @IsNotEmpty()
  @IsUUID()
  contestant_id: string;

  @IsNotEmpty()
  @IsUUID()
  battle_id: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number; // Cantidad de la apuesta
}

export class UpdateBetDto {
    @IsOptional()
    @IsBoolean()
    won?: boolean; // Resultado de la apuesta (ganó o perdió)
  }
