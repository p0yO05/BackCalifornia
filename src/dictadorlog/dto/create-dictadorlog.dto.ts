import { IsEmail, IsString, MinLength, IsUUID } from "class-validator";

export class CreateDictadorlogDto {
    @IsString()
    @MinLength(3)
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(12)
    readonly password: string;

    @IsUUID()
    dictadorId: string;
}