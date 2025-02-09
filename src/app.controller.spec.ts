import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RmqContext } from '@nestjs/microservices';
import { XRayPattern } from './constants/x-ray-pattern';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService], // Provide the service (mocked or real)
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle xRayDataHandles message', () => {
    const data = [1, 2, 3];
    const mockAck = jest.fn();
    const context: RmqContext = {
      getChannelRef: () => ({ ack: mockAck }),
      getMessage: () => ({}),
    } as any;

    const xRayDataHandlerSpy = jest.spyOn(service, 'xRayDataHandler'); // Spy on the service method

    controller.xRayDataHandles(data, context);

    expect(xRayDataHandlerSpy).toHaveBeenCalled(); // Check if the service method was called
    // expect(mockAck).toHaveBeenCalled(); // Verify the message was acknowledged
  });

  it('should not acknowledge if service throws error', () => {
    const data = [1, 2, 3];
    const mockAck = jest.fn();
    const context: RmqContext = {
      getChannelRef: () => ({ ack: mockAck }),
      getMessage: () => ({}),
    } as any;

    jest.spyOn(service, 'xRayDataHandler').mockImplementation(() => {
      throw new Error('Test error');
    });

    try {
      controller.xRayDataHandles(data, context);
    } catch (e) {
      // Do nothing
    }

    expect(mockAck).not.toHaveBeenCalled(); // Verify the message was NOT acknowledged
  });
});
