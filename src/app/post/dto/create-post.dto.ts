import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "src/app/category/entities/category.entity";

export class CreatePostDto {

  @ApiProperty({
    description: 'Um Titulo para o post',
    example: 'Presidente do brasil viaja essa semana.'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Fala sobre o post',
    example: 'Mais uma vez vereador fulano ganha a eleição.'
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Url da image do perfil'
  })
  @IsNotEmpty()
  @IsString()
  mainImageUrl: string;

  @ApiProperty({
    description: 'Adicionar o id da categoria que foi criada',
    example: '1'
  })
  @IsNumber()
  @IsOptional()
  categotyId: number;

  @ApiProperty({
    description:'nome da categoria relacionada a este post',
    example: 'Futebool'
  })
  @IsOptional()
  category: Category;
}
