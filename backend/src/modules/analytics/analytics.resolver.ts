import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Mutation(() => Boolean, {
    description: 'Catat interaksi user (view, click, like)',
  })
  async trackEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Args('actionType') actionType: string,
    @Args('targetId') targetId: string,
  ) {
    await this.analyticsService.trackEvent(
      user.accountId,
      actionType,
      targetId,
    );
    return true;
  }
}
