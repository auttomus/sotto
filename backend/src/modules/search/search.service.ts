import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  /** Pencarian listing berdasarkan query teks dan filter opsional */
  async searchListings(query: string, tagIds?: bigint[]) {
    return this.prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          ...(tagIds?.length
            ? [
                {
                  id: {
                    in: (
                      await this.prisma.taggedObject.findMany({
                        where: {
                          tagId: { in: tagIds },
                          objectType: 'Listing',
                        },
                        select: { objectId: true },
                      })
                    ).map((to) => BigInt(to.objectId)),
                  },
                },
              ]
            : []),
        ],
      },
      include: {
        account: {
          select: { displayName: true, username: true, trustScore: true },
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Pencarian akun berdasarkan nama, username, atau jurusan */
  async searchAccounts(query: string) {
    return this.prisma.account.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { major: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { school: { select: { name: true } } },
      take: 20,
    });
  }
}
