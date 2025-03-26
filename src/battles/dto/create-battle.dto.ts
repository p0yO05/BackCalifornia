import { IsString, IsUUID, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateBattleDto {
  @IsString()
  name: string; // Nombre del evento

  @IsOptional()
  @IsString()
  description?: string; // Descripción opcional

  @IsUUID()
  organizerId: string; // ID del dictador organizador

  @IsUUID()
  contestant_1_id: string; // ID del primer concursante

  @IsUUID()
  contestant_2_id: string; // ID del segundo concursante

  @IsOptional()
  @IsUUID()
  winner_id?: string; // ID del ganador (opcional)

  @IsOptional()
  @IsBoolean()
  death_occurred?: boolean; // Indica si ocurrió una muerte (opcional)

  @IsOptional()
  @IsInt()
  kills?: number; // Número de muertes en el combate (opcional)

  @IsOptional()
  @IsString()
  injuries?: string; // Descripción de las lesiones (opcional)

  @IsOptional()
  @IsBoolean()
  betrayal_occurred?: boolean; // Indica si ocurrió una traición (opcional)

  @IsOptional()
  @IsBoolean()
  miraculous_escape?: boolean; // Indica si ocurrió un escape milagroso (opcional)
}