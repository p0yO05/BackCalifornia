import { IsString, IsInt, IsUUID, Min, Max } from 'class-validator';

export class CreateDictadorDto {
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly territory: string;

  @IsInt()
  @Min(0)
  readonly number_of_slaves: number;

  @IsInt()
  @Min(1)
  @Max(100)
  readonly loyalty_to_Carolina: number;
}