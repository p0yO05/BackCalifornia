import { PartialType } from '@nestjs/mapped-types';
import { CreateBetDto } from './create-dictador-bet.dto';

export class UpdateDictadorBetDto extends PartialType(CreateBetDto) {}


import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateBetDto {
  @IsOptional()
  @IsBoolean()
  won?: boolean; // Resultado de la apuesta (ganó o perdió)
}

