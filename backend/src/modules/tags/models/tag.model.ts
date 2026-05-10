import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TagModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  isUsable: boolean;
}
