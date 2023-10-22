import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import VideoPlatform from '../enums/video-type.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class VideoQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(VideoPlatform, { message: 'Plataforma não encontrada no sistema.' })
  platform?: VideoPlatform;

  @ApiProperty({ required: false })
  @IsOptional()
  title?: string;
}
