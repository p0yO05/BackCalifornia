import { IsString, IsInt, IsEnum, Min, Max, IsUUID, IsOptional } from 'class-validator';
import { Estado } from '../entities/estado.enum';

export class CreateEsclavoDto {

  @IsString()
  readonly name: string;

  @IsString()
  readonly nickname: string;

  @IsString()
  readonly origin: string;

  @IsInt()
  @Min(1)
  @Max(100)
  readonly strength: number;

  @IsInt()
  @Min(1)
  @Max(100)
  readonly agility: number;

  @IsOptional()
  @IsInt()
  readonly wins?: number;

  @IsOptional()
  @IsInt()
  readonly losses?: number;

  @IsEnum(Estado)
  readonly status: Estado;

  @IsOptional()
  @IsString()
  readonly healthStatus?: string;

  @IsUUID()
  dictadorId: string;
}