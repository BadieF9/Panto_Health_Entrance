import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import * as fs from 'fs/promises';
import { join } from 'path';
import { XrayPattern } from 'src/constants/x-ray-pattern';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'x_ray_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendXrayDataFromFile(): Promise<void> {
    try {
      const xrayData = await this.readAndParseJson('./x-ray.json');

      await this.client.emit(XrayPattern.DATA, xrayData);

      this.logger.log('X-ray data sent from file');
    } catch (error) {
      this.logger.error('Error sending x-ray data from file:', error);
    }
  }

  private async readAndParseJson(filePath: string): Promise<any> {
    try {
      const fullPath = join(process.cwd(), filePath);
      console.log('Reading file:', fullPath);

      return await fs.readFile(fullPath, 'utf8');
    } catch (error) {
      throw new BadRequestException(
        `Error reading or parsing JSON file: ${error.message}`,
      );
    }
  }
}
