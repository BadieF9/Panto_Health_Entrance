import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  xRayDataHandler(): void {
    console.log('Hello X-Ray!');
  }
}
