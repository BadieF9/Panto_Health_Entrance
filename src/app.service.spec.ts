import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call console.log in xRayDataHandler', () => {
    const consoleLogSpy = jest.spyOn(console, 'log'); // Spy on console.log

    service.xRayDataHandler();

    expect(consoleLogSpy).toHaveBeenCalledWith('Hello X-Ray!');
  });
});