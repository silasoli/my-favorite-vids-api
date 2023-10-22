import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import VideoPlatform from '../enums/video-type.enum';

export class CreateVideoDto {
  @ApiProperty({ required: true })
  @IsString({ message: 'O ID do usuário deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar o ID do usuário.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  user_id: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'O Título do video deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar o título do video.' })
  @Transform(({ value }) => value.toLowerCase())
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar a plataforma do video.' })
  @IsEnum(VideoPlatform, { message: 'Plataforma não encontrada no sistema.' })
  platform: VideoPlatform;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateIf((value) => value != undefined)
  @IsString({ message: 'A descrição do video deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar a descrição do video.' })
  description: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'A URL do video deve ser uma string.' })
  @IsNotEmpty({ message: 'É necessário informar a URL do video.' })
  url: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar a privacidade do video.' })
  privy: boolean;
}

export class UserCreateVideoDto extends OmitType(CreateVideoDto, [
  'user_id',
] as const) {}
