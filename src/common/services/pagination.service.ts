import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PaginateDto } from '../dtos/paginate.dto';

@Injectable()
export class PaginationService {
  public async pagination(
    model: Model<any>,
    page = null,
    query: object = {},
  ): Promise<PaginateDto<any>> {
    page = Number(page);

    const pageSize = 10;

    const total = await model.count(query);

    const pages = Math.ceil(total / pageSize);

    if (!page || page === 0) return { data: await model.find(query) };

    const data = await model
      .find(query)
      .skip(10 * page - 10)
      .limit(pageSize);

    const meta = { page, take: pageSize, total, pages };

    return new PaginateDto(data, meta);
  }
}
