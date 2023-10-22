import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  pages: number;
}

export class PaginateDto<T> {
  @ApiProperty()
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta?: PageMetaDto;

  constructor(data: T[], meta?: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
