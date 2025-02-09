import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { XRayPattern } from './constants/x-ray-pattern';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(XRayPattern.DATA)
  xRayDataHandles(@Payload() data: number[], @Ctx() context: RmqContext) {
    this.appService.xRayDataHandler();
  }
}
