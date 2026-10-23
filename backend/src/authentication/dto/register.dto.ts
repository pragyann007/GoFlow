import { IsNotEmpty, IsOptional, IsString } from "class-validator"
export class RegisterDTO {
    
    @IsString()
    @IsNotEmpty()
    firstName:string;

    @IsString()
    @IsNotEmpty()
    lastName:string;
    

    @IsString()
    @IsOptional()
    email:string;
    @IsString()
    @IsOptional()
    password?:string;
}