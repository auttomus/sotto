import { Body, Controller, Get, Post } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // Endpoint: POST /listings (Terlindungi oleh Global JWT Guard)
  @Post()
  async createListing(
    @CurrentUser() user: { userId: string; accountId: string },
    @Body() dto: CreateListingDto,
  ) {
    // Kita lempar accountId milik user dan data dari DTO ke Service
    return this.listingsService.create(user.accountId, dto);
  }

  // Endpoint: GET /listings (Terlindungi oleh Global JWT Guard)
  @Get()
  async getAllListings() {
    return this.listingsService.findAll();
  }
}
