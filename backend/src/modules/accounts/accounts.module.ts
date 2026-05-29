import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsResolver } from './accounts.resolver';
import { FollowsService } from './follows.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [AccountsResolver, AccountsService, FollowsService],
  exports: [AccountsService, FollowsService],
})
export class AccountsModule {}
