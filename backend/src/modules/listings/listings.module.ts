import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsResolver } from './listings.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ListingsResolver, ListingsService], // Resolver masuk di providers
})
export class ListingsModule {}
