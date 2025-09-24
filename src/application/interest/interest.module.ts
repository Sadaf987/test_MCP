import { Module } from '@nestjs/common';
import { InterestService } from './services/interest.service';
import { InterestController } from '../../interfaces/http/interest.controller';

@Module({
  controllers: [InterestController],
  providers: [InterestService],
  exports: [InterestService],
})
export class InterestModule {}
