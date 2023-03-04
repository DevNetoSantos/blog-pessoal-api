import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do autor que vai criar os post do blog.',
    example: 'Raimundo'
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: 'Sobre nome do autor',
    example: 'Neto'
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: 'Email do usuario para login',
    example: 'neto@gmail.com'
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha de acesso ao painel de criar post',
    example: '123456'
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Foto do perfil',
    example: 'uma foto bem bonita'
  })
  @IsOptional()
  @IsString()
  profilePic: string;
}
