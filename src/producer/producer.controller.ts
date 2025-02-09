import { Controller, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('send-from-file')
  async sendFromFile() {
    await this.producerService.sendXrayDataFromFile();
    return { message: 'X-ray data sent from file' };
  }
}
