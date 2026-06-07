import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MinioService } from '../../infrastructure/minio/minio.service';
import { randomUUID } from 'crypto';

@Injectable()
export class IamService {
  private readonly logger = new Logger(IamService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly minio: MinioService,
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

    const majorExists = await this.prisma.major.findFirst({
      where: { id: dto.majorId, schoolId: dto.schoolId, isActive: true },
    });
    if (!majorExists) {
      throw new BadRequestException(
        'ID Jurusan tidak valid atau tidak tersedia di sekolah ini.',
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

    // Generate key avatar default sebelum disimpan ke DB
    const avatarUuid = randomUUID();
    const avatarObjectKey = `avatar/${avatarUuid}.svg`;

    // 3. Transaksi Database (Atomic)
    const result = await this.prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          username: dto.username,
          displayName: dto.displayName,
          schoolId: dto.schoolId,
          majorId: dto.majorId,
          avatarObjectKey: avatarObjectKey,
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

    // 4. Unggah default SVG avatar ke Cloudflare R2 secara background/async
    try {
      const svg = generateSvgAvatar(dto.displayName);
      await this.minio.uploadBuffer(
        avatarObjectKey,
        Buffer.from(svg),
        'image/svg+xml',
      );
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Gagal mengunggah avatar bawaan untuk ${dto.username}: ${errMsg}`,
      );
    }

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

/**
 * Membuat inisial nama dengan desain premium & gradasi warna yang dinamis
 */
function generateSvgAvatar(name: string): string {
  const MAX_NAME_LENGTH = 128;
  const safeName =
    typeof name === 'string' ? name.trim().slice(0, MAX_NAME_LENGTH) : '';
  const initial = safeName ? safeName.charAt(0).toUpperCase() : '?';

  // Daftar warna gradasi premium yang modern dan estetis
  const gradients = [
    { start: '#6366F1', end: '#A855F7' }, // Indigo ke Violet
    { start: '#0D9488', end: '#10B981' }, // Teal ke Emerald
    { start: '#F43F5E', end: '#FB923C' }, // Rose ke Orange
    { start: '#2563EB', end: '#06B6D4' }, // Blue ke Cyan
    { start: '#7C3AED', end: '#D946EF' }, // Violet ke Fuchsia
    { start: '#EA580C', end: '#FACC15' }, // Orange ke Yellow
  ];

  // Hitung hash deterministik dari nama agar pengguna yang sama selalu mendapat gradasi warna yang sama
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  const { start, end } = gradients[index];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <defs>
    <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${start}"/>
      <stop offset="100%" stop-color="${end}"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" fill="url(#avatar-grad)"/>
  <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="bold" font-size="64" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
    ${initial}
  </text>
</svg>`;
}
