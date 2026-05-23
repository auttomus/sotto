import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MajorModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => ID)
  schoolId: string;
}
