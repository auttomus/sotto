import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListingInput } from './dto/create-listing.input';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(accountId: string, input: CreateListingInput) {
    try {
      const listing = await this.prisma.listing.create({
        data: {
          title: input.title,
          description: input.description,
          price: input.basePrice,
          accountId: BigInt(accountId),
        },
      });

      // Konversi manual agar GraphQL tidak crash saat membaca BigInt & Decimal
      return {
        ...listing,
        id: listing.id.toString(),
        accountId: listing.accountId.toString(),
        price: listing.price.toNumber(),
      };
    } catch (error) {
      console.error('Error DB saat membuat listing:', error);
      throw new InternalServerErrorException('Gagal membuat listing baru.');
    }
  }

  async findAll() {
    const listings = await this.prisma.listing.findMany({
      include: {
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

    // Petakan semua hasil dan konversi tipe datanya
    return listings.map((listing) => ({
      ...listing,
      id: listing.id.toString(),
      accountId: listing.accountId.toString(),
      price: listing.price.toNumber(),
      account: listing.account
        ? {
            ...listing.account,
            trustScore: listing.account.trustScore.toNumber(),
          }
        : null,
    }));
  }
}
