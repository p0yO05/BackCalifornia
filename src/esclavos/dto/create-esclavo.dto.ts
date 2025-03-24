import { IsString, IsInt, IsEnum, Min, Max } from 'class-validator';
import { Estado } from '../entities/estado.enum';

export class CreateEsclavoDto {
  @IsString()
  readonly id: string;

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

  @IsInt()
  readonly wins: number;

  @IsInt()
  readonly losses: number;

  @IsEnum(Estado)
  readonly status: Estado;

  @IsString()
  readonly healthStatus: string;
}
