import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';

@Module({
  providers: [SearchResolver, SearchService],
  exports: [SearchService],
})
export class SearchModule {}
