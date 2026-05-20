import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsResolver } from './listings.resolver';
import { TagsModule } from '../tags/tags.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [TagsModule, MediaModule],
  providers: [ListingsResolver, ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
