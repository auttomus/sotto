import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

@InputType() // Menandai ini sebagai input untuk Mutation GraphQL
export class CreateListingInput {
  @Field() // Mengeskpos properti ini ke skema GraphQL
  @IsString()
  @IsNotEmpty({ message: 'Judul layanan tidak boleh kosong.' })
  @MaxLength(100, { message: 'Judul maksimal 100 karakter.' })
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong.' })
  description: string;

  // GraphQL tidak mengenal tipe bawaan number, jadi kita pakai Float
  @Field(() => Float)
  @IsNumber({}, { message: 'Harga harus berupa angka.' })
  @Min(0, { message: 'Harga tidak boleh negatif.' })
  basePrice: number;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Kategori wajib diisi.' })
  category: string;
}
