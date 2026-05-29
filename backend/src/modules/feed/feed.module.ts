import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedResolver } from './feed.resolver';
import { TagsModule } from '../tags/tags.module';
import { MediaModule } from '../media/media.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TagsModule, MediaModule, NotificationsModule],
  providers: [FeedResolver, FeedService],
  exports: [FeedService],
})
export class FeedModule {}
