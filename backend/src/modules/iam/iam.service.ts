import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class IamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 0. Validasi Integritas Relasional (Mencegah Error 500 Foreign Key)
    const schoolExists = await this.prisma.school.findUnique({
      where: { id: dto.schoolId },
    });
    if (!schoolExists) {
      throw new BadRequestException(
        'ID Sekolah tidak valid atau tidak ditemukan di sistem.',
      );
    }

    // 1. Pengecekan Duplikasi
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail)
      throw new ConflictException('Email sudah terdaftar di platform.');

    const existingUsername = await this.prisma.account.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername)
      throw new ConflictException('Username sudah digunakan pengguna lain.');

    // 2. Enkripsi Kata Sandi
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Transaksi Database (Atomic)
    const result = await this.prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          username: dto.username,
          displayName: dto.displayName,
          schoolId: dto.schoolId,
          major: dto.major,
        },
      });

      const user = await tx.user.create({
        data: {
          email: dto.email,
          encryptedPassword: hashedPassword,
          accountId: account.id,
        },
      });

      return { user, account };
    });

    const payload = {
      sub: result.user.id,
      accountId: result.account.id,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: result.user.id.toString(),
        accountId: result.account.id.toString(),
        username: result.account.username,
        displayName: result.account.displayName,
        avatarObjectKey: result.account.avatarObjectKey,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { account: true },
    });
    if (!user) throw new UnauthorizedException('Email atau kata sandi salah.');

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.encryptedPassword,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Email atau kata sandi salah.');

    const payload = {
      sub: user.id,
      accountId: user.accountId,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id.toString(),
        accountId: user.accountId.toString(),
        username: user.account.username,
        displayName: user.account.displayName,
        avatarObjectKey: user.account.avatarObjectKey,
      },
    };
  }
}
