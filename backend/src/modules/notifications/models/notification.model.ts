import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

registerEnumType(NotificationType, { name: 'NotificationType' });

@ObjectType()
export class NotificationModel {
  @Field(() => ID)
  id: string;

  /** ID of the user who receives this notification */
  @Field(() => ID)
  accountId: string;

  @Field(() => NotificationType)
  type: NotificationType;

  /** Polymorphic target type: "ScyllaPost", "Order", "Listing", etc. */
  @Field(() => String, { nullable: true })
  targetType?: string | null;

  /** Polymorphic target ID */
  @Field(() => String, { nullable: true })
  targetId?: string | null;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;

  /** ID of the account that triggered this notification (optional) */
  @Field(() => String, { nullable: true })
  fromAccountId?: string | null;

  /** Resolved: display name of the triggering account */
  @Field(() => String, { nullable: true })
  fromDisplayName?: string | null;
}
