import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import * as fs from 'fs/promises';
import { join } from 'path';
import { XrayPattern } from '../constants/x-ray-pattern';

@Injectable()
export class ProducerService {
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

  async sendXrayDataFromFile(): Promise<void | InternalServerErrorException> {
    try {
      const xrayData = await this.readAndParseJson('./x-ray.json');

      await this.client.emit(XrayPattern.DATA, xrayData);
    } catch (error) {
      return new InternalServerErrorException(
        `Error sending x-ray data from file: ${error}`,
      );
    }
  }

  private async readAndParseJson(filePath: string): Promise<any> {
    try {
      const fullPath = join(process.cwd(), filePath);

      return await fs.readFile(fullPath, 'utf8');
    } catch (error) {
      throw new BadRequestException(
        `Error reading or parsing JSON file: ${error.message}`,
      );
    }
  }
}
