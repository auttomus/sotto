import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { EscrowService } from './escrow.service';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [EscrowService, PaymentsService],
  exports: [EscrowService, PaymentsService],
})
export class PaymentsModule {}
