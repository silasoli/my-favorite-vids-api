import { Global, Module } from '@nestjs/common';
import { PaginationService } from './services/pagination.service';

@Global()
@Module({
  imports: [],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class CommonModule {}
