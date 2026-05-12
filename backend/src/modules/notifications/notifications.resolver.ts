import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { NotificationModel } from './models/notification.model';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';

@Resolver(() => NotificationModel)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [NotificationModel], { name: 'notifications' })
  async getNotifications(
    @CurrentUser() user: CurrentUserPayload,
    @Args('cursor', { nullable: true }) cursor?: string,
    @Args('take', { type: () => Int, defaultValue: 20, nullable: true })
    take?: number,
  ) {
    const results = await this.notificationsService.getNotifications(
      user.accountId,
      cursor,
      take,
    );
    return results.map((n) => ({
      ...n,
      id: n.id,
      accountId: n.accountId,
      fromAccountId: n.fromAccountId ?? null,
      fromDisplayName:
        (n as { fromAccount?: { displayName?: string | null } | null })
          .fromAccount?.displayName ?? null,
    }));
  }

  @Query(() => Int, { name: 'unreadNotificationCount' })
  async getUnreadCount(@CurrentUser() user: CurrentUserPayload) {
    return this.notificationsService.getUnreadCount(user.accountId);
  }

  @Mutation(() => Boolean)
  async markNotificationAsRead(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
  ) {
    await this.notificationsService.markAsRead(id, user.accountId);
    return true;
  }

  @Mutation(() => Boolean)
  async markAllNotificationsAsRead(@CurrentUser() user: CurrentUserPayload) {
    await this.notificationsService.markAllAsRead(user.accountId);
    return true;
  }
}
