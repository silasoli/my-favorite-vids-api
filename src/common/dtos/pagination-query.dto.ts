import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required: false, description: 'Page to return' })
  @IsOptional()
  page?: number;

  //   @ApiProperty({
  //     required: false,
  //     description: 'Field to search',
  //   })
  //   @IsOptional()
  //   fieldSearch?: string;

  //   @ApiProperty({ required: false, description: 'String field to search' })
  //   @IsOptional()
  //   search?: string;

  //   @ApiProperty({
  //     required: false,
  //     description: 'Field by which the records will be sorted',
  //   })
  //   @IsOptional()
  //   fieldSort?: string;

  //   @ApiProperty({
  //     required: false,
  //     description: 'Field that indicates the ordering',
  //     enum: ['ASC', 'DESC'],
  //   })
  //   @IsOptional()
  //   sort?: string;
}
