
import { IsString, IsNotEmpty, IsInt, Min,Max} from "class-validator";

export class CreateSponsorshipDto {
  @IsNotEmpty()
  @IsString({ message: 'Sponsor ID must be a string' })
  sponsorId: string;
  
  @IsNotEmpty()
  @IsString({ message: 'Esclavo ID must be a string' })
  esclavoId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  strenghtDrug: number;

  @IsInt()
  @Min(0)
  @Max(100)
  agilityDrug: number;
}