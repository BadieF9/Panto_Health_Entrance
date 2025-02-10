import { Controller, HttpCode, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('producers')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post('send-from-file')
  @HttpCode(200)
  @ApiOperation({ summary: 'Import X-ray data from JSON file' })
  @ApiResponse({ status: 200, description: 'X-ray data sent from file' })
  async sendFromFile() {
    await this.producerService.sendXrayDataFromFile();
    return { message: 'X-ray data sent from file' };
  }
}
