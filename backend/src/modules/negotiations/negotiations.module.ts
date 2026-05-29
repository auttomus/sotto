import { Module } from '@nestjs/common';
import { NegotiationsService } from './negotiations.service';
import { NegotiationsResolver } from './negotiations.resolver';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [NegotiationsResolver, NegotiationsService],
  exports: [NegotiationsService],
})
export class NegotiationsModule {}
