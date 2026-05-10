import { Type } from '@nestjs/common';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsPositive, Max } from 'class-validator';

/**
 * Argumen pagination berbasis cursor.
 * Digunakan sebagai @Args() di resolver GraphQL.
 *
 * Contoh penggunaan:
 *   @Query(() => PaginatedListings)
 *   async listings(@Args() pagination: PaginationArgs) { ... }
 */
@ArgsType()
export class PaginationArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Cursor posisi terakhir (ID dari item terakhir)',
  })
  @IsOptional()
  cursor?: string;

  @Field(() => Int, {
    defaultValue: 20,
    description: 'Jumlah item per halaman (maks 50)',
  })
  @IsOptional()
  @IsPositive()
  @Max(50)
  take?: number = 20;
}

/**
 * Factory untuk membuat tipe respons pagination generik.
 * Setiap domain perlu membuat concrete class:
 *
 *   @ObjectType()
 *   export class PaginatedListings extends Paginated(ListingModel) {}
 *
 * Lalu digunakan di resolver:
 *   @Query(() => PaginatedListings)
 *   async listings(@Args() pagination: PaginationArgs) { ... }
 */
export function Paginated<T>(classRef: Type<T>): Type<{
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef])
    items: T[];

    @Field(() => String, {
      nullable: true,
      description: 'Cursor untuk halaman berikutnya. Null jika sudah habis.',
    })
    nextCursor?: string;

    @Field(() => Boolean, {
      description: 'Apakah masih ada halaman selanjutnya',
    })
    hasMore: boolean;
  }

  return PaginatedType as Type<{
    items: T[];
    nextCursor?: string;
    hasMore: boolean;
  }>;
}
