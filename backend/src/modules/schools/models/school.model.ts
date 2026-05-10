import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SchoolModel {
  @Field(() => ID)
  id: string;

  @Field()
  npsn: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  domain?: string | null;

  @Field({ nullable: true })
  city?: string | null;

  @Field()
  isVerified: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
