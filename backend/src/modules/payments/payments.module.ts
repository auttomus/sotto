import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { EscrowService } from './escrow.service';

@Module({
  controllers: [PaymentsController],
  providers: [EscrowService],
  exports: [EscrowService],
})
export class PaymentsModule {}
