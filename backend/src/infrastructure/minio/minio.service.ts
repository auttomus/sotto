import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
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

    this.client = new Minio.Client({
      endPoint: this.config.get('MINIO_ENDPOINT', 'localhost'),
      port: Number(this.config.get('MINIO_PORT', '9000')),
      useSSL: this.config.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.config.get('MINIO_ACCESS_KEY', 'admin_minio'),
      secretKey: this.config.get(
        'MINIO_SECRET_KEY',
        'supersecret_minio_password',
      ),
    });

    // Pastikan bucket ada
    await this.ensureBucket(this.bucketPublic);
    await this.ensureBucket(this.bucketPrivate);
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
    const endpoint = this.config.get('MINIO_ENDPOINT', 'localhost');
    const port = this.config.get('MINIO_PORT', '9000');
    const ssl = this.config.get('MINIO_USE_SSL', 'false') === 'true';
    const protocol = ssl ? 'https' : 'http';
    return `${protocol}://${endpoint}:${port}/${this.bucketPublic}/${objectKey}`;
  }

  private async ensureBucket(name: string) {
    const exists = await this.client.bucketExists(name);
    if (!exists) {
      await this.client.makeBucket(name);
      this.logger.log(`Bucket "${name}" dibuat`);
    }
  }
}
