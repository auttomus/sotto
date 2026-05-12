import { InputType, Field, Float, Int, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  MaxLength,
  Min,
} from 'class-validator';
import { ListingType } from '@prisma/client';

@InputType()
export class CreateListingInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Judul layanan tidak boleh kosong.' })
  @MaxLength(100, { message: 'Judul maksimal 100 karakter.' })
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong.' })
  description: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Harga harus berupa angka.' })
  @Min(0, { message: 'Harga tidak boleh negatif.' })
  basePrice: number;

  @Field(() => String, { defaultValue: 'SERVICE' })
  @IsOptional()
  type?: ListingType;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  deliveryTimeDays?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxActiveOrders?: number;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isUnlimited?: boolean;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  mediaIds?: string[];
}
