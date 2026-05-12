import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioService } from '../../infrastructure/minio/minio.service';
import { RequestUploadInput } from './dto/request-upload.input';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  /**
   * Step 1: Frontend meminta URL upload.
   * Mengembalikan presigned PUT URL + objectKey.
   * Frontend langsung upload file ke MinIO via URL ini.
   */
  async requestUploadUrl(accountId: string, input: RequestUploadInput) {
    const ext = input.fileName.split('.').pop() || 'bin';
    const objectKey = `${input.attachedType.toLowerCase()}/${randomUUID()}.${ext}`;
    const isPrivate = input.isPrivate ?? false;

    const uploadUrl = await this.minio.getPresignedUploadUrl(
      objectKey,
      isPrivate,
    );

    return { uploadUrl, objectKey };
  }

  /**
   * Step 2: Setelah upload selesai, frontend konfirmasi.
   * Membuat record MediaAttachment di PostgreSQL.
   */
  async confirmUpload(
    accountId: string,
    objectKey: string,
    input: RequestUploadInput,
  ) {
    return this.prisma.mediaAttachment.create({
      data: {
        accountId: accountId,
        attachedType: input.attachedType,
        attachedId: input.attachedId ?? '',
        fileName: input.fileName,
        contentType: input.contentType,
        fileSize: 0, // Akan diisi nanti jika perlu
        objectKey,
        isPrivate: input.isPrivate ?? false,
        bucketName: input.isPrivate ? 'private-assets' : 'public-assets',
      },
    });
  }

  /** Ambil semua media untuk sebuah objek (post, listing, dll.) */
  async getMediaForObject(attachedType: string, attachedId: string) {
    const media = await this.prisma.mediaAttachment.findMany({
      where: { attachedType, attachedId },
      orderBy: { createdAt: 'asc' },
    });

    // Resolve URL untuk setiap media
    return Promise.all(
      media.map(async (m) => ({
        ...m,
        id: m.id,
        fileSize: m.fileSize.toString(),
        url: m.isPrivate
          ? await this.minio.getPresignedDownloadUrl(m.objectKey, true)
          : this.minio.getPublicUrl(m.objectKey),
      })),
    );
  }

  /** Hapus media attachment (dari DB + MinIO) */
  async deleteMedia(mediaId: string, accountId: string) {
    const media = await this.prisma.mediaAttachment.findFirst({
      where: { id: mediaId, accountId: accountId },
    });
    if (!media) throw new NotFoundException('Media tidak ditemukan');

    await this.minio.deleteObject(media.objectKey, media.isPrivate);
    await this.prisma.mediaAttachment.delete({ where: { id: mediaId } });
  }

  /** Hapus media yang tidak bertuan (orphaned) > 24 jam */
  async cleanupOrphanedMedia() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const orphans = await this.prisma.mediaAttachment.findMany({
      where: {
        attachedId: '',
        createdAt: { lt: oneDayAgo },
      },
    });

    if (orphans.length === 0) return 0;

    for (const m of orphans) {
      try {
        await this.minio.deleteObject(m.objectKey, m.isPrivate);
        await this.prisma.mediaAttachment.delete({ where: { id: m.id } });
      } catch {
        // Continue even if one fails
      }
    }
    return orphans.length;
  }
}
