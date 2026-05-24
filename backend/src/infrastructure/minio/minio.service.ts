import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private bucketPublic: string;
  private bucketPrivate: string;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.bucketPublic = this.config.get('MINIO_BUCKET_PUBLIC', 'public-assets');
    this.bucketPrivate = this.config.get(
      'MINIO_BUCKET_PRIVATE',
      'private-assets',
    );

    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const portVal = this.config.get<string>('MINIO_PORT', '');
    const useSSL = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';

    this.client = new Minio.Client({
      endPoint: endpoint,
      useSSL,
      ...(portVal ? { port: Number(portVal) } : useSSL ? {} : { port: 9000 }),
      accessKey: this.config.get('MINIO_ACCESS_KEY', 'admin_minio'),
      secretKey: this.config.get(
        'MINIO_SECRET_KEY',
        'supersecret_minio_password',
      ),
    });

    // Pastikan bucket ada
    await this.ensureBucket(this.bucketPublic, true);
    await this.ensureBucket(this.bucketPrivate, false);
    this.logger.log('MinIO terhubung, bucket siap');
  }

  /** Akses langsung ke MinIO client */
  getClient(): Minio.Client {
    return this.client;
  }

  /**
   * Generate presigned URL untuk upload (PUT).
   * Frontend mengirim file langsung ke MinIO via URL ini.
   */
  async getPresignedUploadUrl(
    objectKey: string,
    isPrivate = false,
    expirySeconds = 3600,
  ): Promise<string> {
    const bucket = isPrivate ? this.bucketPrivate : this.bucketPublic;
    return this.client.presignedPutObject(bucket, objectKey, expirySeconds);
  }

  /**
   * Mengunggah buffer data langsung dari backend ke bucket.
   * Digunakan untuk aset internal atau inisiasi gambar bawaan (default avatar).
   */
  async uploadBuffer(
    objectKey: string,
    buffer: Buffer,
    contentType: string,
    isPrivate = false,
  ): Promise<void> {
    const bucket = isPrivate ? this.bucketPrivate : this.bucketPublic;
    await this.client.putObject(bucket, objectKey, buffer, buffer.length, {
      'content-type': contentType,
    });
  }

  /**
   * Generate presigned URL untuk download (GET).
   * Digunakan untuk file private (produk digital, attachment).
   */
  async getPresignedDownloadUrl(
    objectKey: string,
    isPrivate = false,
    expirySeconds = 3600,
  ): Promise<string> {
    const bucket = isPrivate ? this.bucketPrivate : this.bucketPublic;
    return this.client.presignedGetObject(bucket, objectKey, expirySeconds);
  }

  /** Hapus objek dari bucket */
  async deleteObject(objectKey: string, isPrivate = false): Promise<void> {
    const bucket = isPrivate ? this.bucketPrivate : this.bucketPublic;
    await this.client.removeObject(bucket, objectKey);
  }

  /**
   * URL publik langsung (tanpa presigned) untuk aset publik.
   * Contoh: avatar, thumbnail listing.
   */
  getPublicUrl(objectKey: string): string {
    const publicUrlPrefix = this.config.get<string>('MINIO_PUBLIC_URL');
    if (publicUrlPrefix) {
      const cleanBase = publicUrlPrefix.endsWith('/')
        ? publicUrlPrefix.slice(0, -1)
        : publicUrlPrefix;

      const useSSL =
        this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
      if (useSSL) {
        // Pada Cloudflare R2 / S3 awan, URL subdomain publik sudah mengarah langsung ke root bucket
        return `${cleanBase}/${objectKey}`;
      }
      // Pada MinIO lokal, kita butuh nama bucket di path karena host-nya bersifat global (localhost:9000)
      return `${cleanBase}/${this.bucketPublic}/${objectKey}`;
    }

    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.config.get<string>('MINIO_PORT', '9000');
    const ssl = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const protocol = ssl ? 'https' : 'http';
    const portSuffix = port ? `:${port}` : '';
    return `${protocol}://${endpoint}${portSuffix}/${this.bucketPublic}/${objectKey}`;
  }

  private async ensureBucket(name: string, isPublic = false) {
    try {
      const exists = await this.client.bucketExists(name);
      if (!exists) {
        await this.client.makeBucket(name);
        this.logger.log(`Bucket "${name}" dibuat`);
      }

      if (isPublic) {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${name}/*`],
            },
          ],
        };
        await this.client.setBucketPolicy(name, JSON.stringify(policy));
        this.logger.log(`Bucket policy "${name}" diset menjadi public read`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Gagal memverifikasi/mengatur kebijakan bucket "${name}". ` +
          `Aplikasi akan tetap berjalan dengan asumsi bucket sudah dikonfigurasi melalui IaC/DevOps. ` +
          `Error: ${errMsg}`,
      );
    }
  }
}
