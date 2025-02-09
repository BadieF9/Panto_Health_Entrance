import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';

@Module({
  imports: [],
  providers: [ProducerService],
  controllers: [ProducerController],
})
export class ProducerModule {}
