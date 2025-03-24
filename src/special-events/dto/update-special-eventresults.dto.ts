import { IsOptional, IsString, IsInt, IsBoolean, IsArray } from 'class-validator';

export class UpdateSpecialEventResultDto {
  @IsOptional()
  @IsString()
  winner?: string; // ID del ganador

  @IsOptional()
  @IsInt()
  casualties?: number; // Número de muertes totales

  @IsOptional()
  @IsArray()
  notableMoments?: string[]; // Momentos destacados, estos son joya

  @IsOptional()
  @IsBoolean()
  success?: boolean; // Éxito del evento? o una posible rebelion?
}