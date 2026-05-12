import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Autocomplete: cari tag berdasarkan prefix nama */
  async searchTags(query: string) {
    return this.prisma.tag.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        isUsable: true,
      },
      take: 10,
      orderBy: { name: 'asc' },
    });
  }

  /** Ambil semua tag yang aktif */
  async getAllTags() {
    return this.prisma.tag.findMany({
      where: { isUsable: true },
      orderBy: { name: 'asc' },
    });
  }

  /** Buat tag baru (MVP: open, nanti admin-only) */
  async createTag(name: string) {
    return this.prisma.tag.create({
      data: { name: name.trim() },
    });
  }

  /** Tautkan tag ke objek (polymorphic: "Listing", "ScyllaPost", dll.) */
  async tagObject(tagId: string, objectId: string, objectType: string) {
    return this.prisma.taggedObject.upsert({
      where: {
        objectType_objectId_tagId: { objectType, objectId, tagId },
      },
      update: {},
      create: { tagId, objectId, objectType },
    });
  }

  /** Hapus tag dari objek */
  async untagObject(tagId: string, objectId: string, objectType: string) {
    return this.prisma.taggedObject.deleteMany({
      where: { tagId, objectId, objectType },
    });
  }

  /** Ambil semua tag untuk sebuah objek */
  async getTagsForObject(objectId: string, objectType: string) {
    const taggedObjects = await this.prisma.taggedObject.findMany({
      where: { objectId, objectType },
    });
    if (taggedObjects.length === 0) return [];
    const tagIds = taggedObjects.map((to) => to.tagId);
    return this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
    });
  }

  /** Tautkan banyak tag sekaligus ke satu objek */
  async setTagsForObject(
    tagIds: string[],
    objectId: string,
    objectType: string,
  ) {
    // Hapus tag lama
    await this.prisma.taggedObject.deleteMany({
      where: { objectId, objectType },
    });
    // Pasang tag baru
    if (tagIds.length > 0) {
      await this.prisma.taggedObject.createMany({
        data: tagIds.map((tagId) => ({ tagId, objectId, objectType })),
        skipDuplicates: true,
      });
    }
  }
}
