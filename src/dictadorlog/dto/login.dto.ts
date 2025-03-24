import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDTO {
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(12)
    readonly password: string;
}