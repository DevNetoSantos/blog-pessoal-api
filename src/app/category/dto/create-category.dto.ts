import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: 'criar uma categoria para os posts',
    example: 'Politica, Futebool'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Ciar uma descrição para a categoria',
    example: 'Esta categoria fala sobre politica do brasil'
  })
  @IsOptional()
  @IsString()
  description: string;
}
