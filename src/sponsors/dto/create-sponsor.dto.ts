import { IsNotEmpty, IsString, IsInt, MaxLength, IsDate , IsEnum } from 'class-validator';
export class CreateSponsorDto {
    @IsNotEmpty()
    @IsString()
    company_name: string;

    @IsNotEmpty()
    @IsString()
    preferred_fighter: string;

    @IsNotEmpty()
    @IsString()
    donated_items: string;
}
