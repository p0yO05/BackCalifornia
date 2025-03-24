import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateSpecialEventDto {
  @IsString()
  name: string; // Nombre del evento

  @IsOptional()
  @IsString()
  description?: string; // Descripción opcional

  @IsUUID()
  organizerId: string; // ID del dictador organizador

  @IsArray()
  @IsUUID('4', { each: true })
  participantIds: string[]; // IDs de los esclavos participantes
}