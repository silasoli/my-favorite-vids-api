import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { IsOptional } from 'class-validator';

export class UsersQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  username?: string;
}
