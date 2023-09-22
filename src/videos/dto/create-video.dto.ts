import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar o ID do usuário.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  user_id: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'O Título do video deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar o título do video.' })
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateIf((value) => value != undefined)
  @IsString({ message: 'O Título do video deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar o título do video.' })
  description: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'A URL do video deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar a URL do video.' })
  url: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar a privacidade do video.' })
  privy: boolean;
}
