import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul layanan tidak boleh kosong.' })
  @MaxLength(100, { message: 'Judul maksimal 100 karakter.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong.' })
  description: string;

  // Menggunakan @Type agar string '50000' dari HTTP otomatis jadi angka 50000
  @Type(() => Number)
  @IsNumber({}, { message: 'Harga harus berupa angka.' })
  @Min(0, { message: 'Harga tidak boleh negatif.' })
  basePrice: number;

  @IsString()
  @IsNotEmpty({
    message: 'Kategori wajib diisi (misal: Web Dev, Desain Logo).',
  })
  category: string;
}
