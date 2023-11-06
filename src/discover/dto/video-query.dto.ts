import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import VideoPlatform from '../../videos/enums/video-type.enum';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class VideoQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(VideoPlatform, { message: 'Plataforma não encontrada no sistema.' })
  platform?: VideoPlatform;

  @ApiProperty({ required: false })
  @IsOptional()
  title?: string;
}

export class TitleVideoQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  title?: string;
}

export class UserVideoQuetyDto extends PaginationQueryDto {
  @ApiProperty({ required: true, description: 'Envie um id válido do mongoDB' })
  @IsString({ message: 'O ID deve ser uma string.' })
  @IsNotEmpty({ message: 'O ID não pode estar vazio.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  user_id: string;
}
