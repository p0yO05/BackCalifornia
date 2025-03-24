import { IsUUID, IsOptional, IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateBattleDto {
  @IsUUID()
  contestant_1: string;

  @IsUUID()
  contestant_2: string;

  @IsOptional()
  @IsUUID()
  winner?: string;

  @IsOptional()
  @IsBoolean()
  death_occurred?: boolean;

  @IsOptional()
  @IsInt()
  kills?: number;

  @IsOptional()
  @IsString()
  injuries?: string;

  @IsOptional()
  @IsBoolean()
  betrayal_occurred?: boolean;

  @IsOptional()
  @IsBoolean()
  miraculous_escape?: boolean;
}