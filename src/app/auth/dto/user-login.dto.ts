import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserLoginDto {
  @ApiProperty({
    description: 'email para logar o usuario',
    example: 'neto@gmail.com'
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha de login do usuario',
    example: '123456'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}