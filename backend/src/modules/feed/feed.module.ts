import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedResolver } from './feed.resolver';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TagsModule],
  providers: [FeedResolver, FeedService],
  exports: [FeedService],
})
export class FeedModule {}
