import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/**
 * Menangkap error spesifik dari Prisma ORM dan mengubahnya
 * menjadi respons HTTP yang informatif.
 *
 * Bekerja di konteks REST. Untuk GraphQL, NestJS secara otomatis
 * mengubah HttpException menjadi GraphQL error.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { status, message } = this.mapPrismaError(exception);

    // Deteksi konteks: GraphQL atau HTTP
    const hostType = host.getType();
    if ((hostType as string) === 'graphql') {
      // Lempar HttpException agar NestJS GraphQL layer menanganinya
      throw new HttpException(message, status);
    }

    // Konteks REST: tulis langsung ke respons
    const response = host.switchToHttp().getResponse<Response>();
    response.status(status).json({
      statusCode: status,
      message,
      prismaCode: exception.code,
    });
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (exception.code) {
      case 'P2002': {
        // Unique constraint violation
        const fields =
          (exception.meta?.target as string[])?.join(', ') || 'field';
        return {
          status: HttpStatus.CONFLICT,
          message: `Duplikasi: ${fields} sudah ada di sistem.`,
        };
      }
      case 'P2025':
        // Record not found
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Data yang dimaksud tidak ditemukan.',
        };
      case 'P2003':
        // Foreign key constraint failure
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Referensi data tidak valid (foreign key constraint).',
        };
      case 'P2014':
        // Required relation violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Relasi data yang diperlukan tidak terpenuhi.',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Kesalahan database internal (${exception.code}).`,
        };
    }
  }
}
