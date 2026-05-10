import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

registerEnumType(NotificationType, { name: 'NotificationType' });

@ObjectType()
export class NotificationModel {
  @Field(() => ID)
  id: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field({ nullable: true })
  targetType?: string;

  @Field({ nullable: true })
  targetId?: string;

  @Field()
  isRead: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  fromAccountId?: string;

  // Resolved field: display name dari pengirim
  @Field({ nullable: true })
  fromDisplayName?: string;
}
