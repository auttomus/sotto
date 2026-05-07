import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Format email tidak valid.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password minimal 8 karakter.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password harus mengandung minimal satu huruf dan satu angka.',
  })
  password: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Username tidak boleh kosong.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username hanya boleh berisi huruf, angka, dan underscore.',
  })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama tampilan wajib diisi.' })
  displayName: string;

  @IsNotEmpty({ message: 'ID Sekolah wajib dipilih.' })
  schoolId: number;

  @IsString()
  @IsNotEmpty({
    message:
      'Jurusan (Major) wajib dipilih untuk keperluan algoritma rekomendasi.',
  })
  major: string;
}
