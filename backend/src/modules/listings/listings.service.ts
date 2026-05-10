import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TagsService } from '../tags/tags.service';
import { CreateListingInput } from './dto/create-listing.input';
import { UpdateListingInput } from './dto/update-listing.input';
import { ListingType, ListingStatus, Prisma } from '@prisma/client';

// Explicit return type to satisfy strict TypeScript / no-unsafe-return
type SerializedListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  type: ListingType;
  status: ListingStatus;
  deliveryTimeDays: number | null;
  maxActiveOrders: number | null;
  isUnlimited: boolean;
  category?: string | null;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
  account?: {
    displayName: string;
    major: string | null;
    trustScore: number;
    username: string;
  } | null;
};

type ListingWithAccount = Prisma.ListingGetPayload<{
  include: {
    account: {
      select: {
        displayName: true;
        major: true;
        trustScore: true;
        username: true;
      };
    };
  };
}>;

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
  ) {}

  private serializeListing(listing: ListingWithAccount): SerializedListing {
    return {
      id: listing.id.toString(),
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      type: listing.type,
      status: listing.status,
      deliveryTimeDays: listing.deliveryTimeDays,
      maxActiveOrders: listing.maxActiveOrders,
      isUnlimited: listing.isUnlimited,
      accountId: listing.accountId.toString(),
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      account: listing.account
        ? {
            displayName: listing.account.displayName,
            major: listing.account.major,
            trustScore: Number(listing.account.trustScore),
            username: listing.account.username,
          }
        : null,
    };
  }

  // Prisma doesn't have a 'category' field on Listing — it was planned but not in schema.
  // We store category info via TaggedObject. omit from DB create/update.
  async create(
    accountId: string,
    input: CreateListingInput,
  ): Promise<SerializedListing> {
    const listing = await this.prisma.listing.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.basePrice,
        type: (input.type as ListingType) ?? ListingType.SERVICE,
        deliveryTimeDays: input.deliveryTimeDays,
        maxActiveOrders: input.maxActiveOrders,
        isUnlimited: input.isUnlimited ?? false,
        accountId: BigInt(accountId),
      },
      include: {
        account: {
          select: {
            displayName: true,
            major: true,
            trustScore: true,
            username: true,
          },
        },
      },
    });

    // Tag association
    if (input.tagIds?.length) {
      await this.tagsService.setTagsForObject(
        input.tagIds.map((id) => BigInt(id)),
        listing.id.toString(),
        'Listing',
      );
    }

    return this.serializeListing(listing);
  }

  async update(
    listingId: string,
    accountId: string,
    input: UpdateListingInput,
  ): Promise<SerializedListing> {
    const existing = await this.prisma.listing.findFirst({
      where: { id: BigInt(listingId), accountId: BigInt(accountId) },
      include: {
        account: {
          select: {
            displayName: true,
            major: true,
            trustScore: true,
            username: true,
          },
        },
      },
    });
    if (!existing) throw new NotFoundException('Listing tidak ditemukan.');

    const listing = await this.prisma.listing.update({
      where: { id: BigInt(listingId), lockVersion: existing.lockVersion },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.basePrice !== undefined && { price: input.basePrice }),
        ...(input.deliveryTimeDays !== undefined && {
          deliveryTimeDays: input.deliveryTimeDays,
        }),
        ...(input.maxActiveOrders !== undefined && {
          maxActiveOrders: input.maxActiveOrders,
        }),
        ...(input.isUnlimited !== undefined && {
          isUnlimited: input.isUnlimited,
        }),
        lockVersion: { increment: 1 },
      },
      include: {
        account: {
          select: {
            displayName: true,
            major: true,
            trustScore: true,
            username: true,
          },
        },
      },
    });

    if (input.tagIds) {
      await this.tagsService.setTagsForObject(
        input.tagIds.map((id) => BigInt(id)),
        listing.id.toString(),
        'Listing',
      );
    }

    return this.serializeListing(listing);
  }

  async delete(listingId: string, accountId: string): Promise<boolean> {
    const existing = await this.prisma.listing.findFirst({
      where: { id: BigInt(listingId), accountId: BigInt(accountId) },
    });
    if (!existing) throw new NotFoundException('Listing tidak ditemukan.');
    await this.prisma.listing.delete({ where: { id: BigInt(listingId) } });
    return true;
  }

  async findOne(listingId: string): Promise<SerializedListing> {
    const listing = await this.prisma.listing.findUnique({
      where: { id: BigInt(listingId) },
      include: {
        account: {
          select: {
            displayName: true,
            major: true,
            trustScore: true,
            username: true,
          },
        },
      },
    });
    if (!listing) throw new NotFoundException('Listing tidak ditemukan.');
    return this.serializeListing(listing);
  }

  async findAll(): Promise<SerializedListing[]> {
    const listings = await this.prisma.listing.findMany({
      where: { status: ListingStatus.ACTIVE },
      include: {
        account: {
          select: {
            displayName: true,
            major: true,
            trustScore: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return listings.map((l) => this.serializeListing(l));
  }

  async findByAccount(accountId: string): Promise<SerializedListing[]> {
    const listings = await this.prisma.listing.findMany({
      where: { accountId: BigInt(accountId) },
      include: {
        account: {
          select: {
            displayName: true,
            major: true,
            trustScore: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return listings.map((l) => this.serializeListing(l));
  }
}
