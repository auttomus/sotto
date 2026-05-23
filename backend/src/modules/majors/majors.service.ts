import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MajorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMajorsBySchool(schoolId: string) {
    return await this.prisma.major.findMany({
      where: { schoolId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getMajor(id: string) {
    return await this.prisma.major.findUnique({ where: { id } });
  }
}
