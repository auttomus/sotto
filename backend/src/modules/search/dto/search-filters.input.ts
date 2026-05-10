import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsArray } from 'class-validator';

@InputType()
export class SearchFiltersInput {
  @Field({
    nullable: true,
    description: 'Tipe hasil: "listing" atau "account"',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => [ID], {
    nullable: true,
    description: 'Filter berdasarkan tag IDs',
  })
  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @Field(() => ID, {
    nullable: true,
    description: 'Filter berdasarkan sekolah',
  })
  @IsOptional()
  schoolId?: string;
}
