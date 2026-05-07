import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(accountId: string, dto: CreateListingDto) {
    try {
      const listing = await this.prisma.listing.create({
        data: {
          title: dto.title,
          description: dto.description,
          price: dto.basePrice,
          accountId: BigInt(accountId),
        },
      });

      return {
        message: 'Listing berhasil dipublikasikan.',
        listing,
      };
    } catch (error) {
      // Menggunakan variabel error agar tidak memicu linter no-unused-vars
      console.error('Error DB saat membuat listing:', error);
      throw new InternalServerErrorException('Gagal membuat listing baru.');
    }
  }

  async findAll() {
    const listings = await this.prisma.listing.findMany({
      include: {
        // Menggunakan nama relasi yang benar sesuai schema ('account')
        account: {
          select: {
            displayName: true,
            major: true,
            trustScore: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return listings;
  }
}
