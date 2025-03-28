import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateDictadorDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly territory: string;

  @IsInt()
  @Min(1)
  @Max(100)
  readonly loyalty_to_Carolina: number;
}