import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
//   public async findAllPagination(
//     model: Repository<any>,
//     page = 0,
//     query: object = {},
//   ): Promise<any[] | IPaginate> {
//     const pageSize = 10;

//     const qtyRecords = await model.count(query);

//     const qtyPages = Math.ceil(qtyRecords / pageSize);

//     if (!page) {
//       return model.find(query);
//     }

//     return {
//       qtyRecords,
//       qtyPages,
//       records: await repository.find({
//         ...query,
//         take: pageSize,
//         skip: 10 * page - 10,
//       }),
//     };
//   }
}
