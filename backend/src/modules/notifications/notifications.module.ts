import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsGateway } from './notifications.gateway';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [IamModule],
  providers: [
    NotificationsResolver,
    NotificationsService,
    NotificationsGateway,
  ],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
