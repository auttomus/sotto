import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Format email tidak valid.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong.' })
  password: string;
}
