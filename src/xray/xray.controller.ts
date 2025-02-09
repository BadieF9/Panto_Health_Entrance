import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { XrayPattern } from 'src/constants/x-ray-pattern';
import { SignalService } from 'src/signal/signal.service';

@Controller()
export class XrayController {
  constructor(private readonly signalService: SignalService) {}

  @MessagePattern(XrayPattern.DATA)
  async xRayDataHandler(
    @Payload() data: [number, [number, number, number]][],
    @Ctx() _context: RmqContext,
  ) {
    try {
      const processedData = this.signalService.processXrayData(data);
      const savedSignal = await this.signalService.saveSignal(processedData);
      console.log('Signal saved:', savedSignal);
    } catch (error) {
      console.error('Error in RabbitMQ consumer:', error);
    }
  }
}
