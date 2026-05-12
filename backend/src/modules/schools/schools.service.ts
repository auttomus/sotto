import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async searchSchools(query: string) {
    return this.prisma.school.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { npsn: { contains: query } },
          { city: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { name: 'asc' },
    });
  }

  async getSchool(id: string) {
    return this.prisma.school.findUnique({ where: { id } });
  }

  async getAllSchools() {
    return this.prisma.school.findMany({
      where: { isVerified: true },
      orderBy: { name: 'asc' },
    });
  }
}
