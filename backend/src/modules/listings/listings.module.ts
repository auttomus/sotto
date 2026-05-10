import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsResolver } from './listings.resolver';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TagsModule],
  providers: [ListingsResolver, ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
