// xray.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { XrayController } from './xray.controller';
import { SignalService } from '..//signal/signal.service';
import { CreateXrayDto } from './dto/xray.dto';
import { Xray } from '../schemas/x-ray.schema';
import { NotFoundException } from '@nestjs/common';

describe('XrayController', () => {
  let controller: XrayController;
  let service: SignalService;

  const mockCoordinateSpeed = { x: 10, y: 20, speed: 5 };

  const mockXray: Xray = {
    _id: 'some-id',
    deviceId: 'testDevice',
    time: 1678886400000,
    data: [
      { time: 1234567890, coordinateSpeed: [mockCoordinateSpeed] },
    ] as unknown,
    dataLength: 1,
    dataVolume: JSON.stringify([
      { time: 1234567890, coordinateSpeed: [mockCoordinateSpeed] },
    ]).length,
  } as Xray;

  const createXrayDto: CreateXrayDto = {
    deviceId: 'testDevice',
    time: 1678886400000,
    data: [{ time: 1234567890, coordinateSpeed: [mockCoordinateSpeed] }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XrayController],
      providers: [
        {
          provide: SignalService,
          useValue: {
            saveSignal: jest.fn().mockResolvedValue(mockXray),
            findAll: jest.fn().mockResolvedValue([mockXray]),
            findById: jest.fn().mockResolvedValue(mockXray),
            update: jest.fn().mockResolvedValue(mockXray),
            remove: jest.fn().mockResolvedValue(1),
            findFiltered: jest.fn().mockResolvedValue([mockXray]),
          },
        },
      ],
    }).compile();

    controller = module.get<XrayController>(XrayController);
    service = module.get<SignalService>(SignalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an xray record', async () => {
      const result = await controller.create(createXrayDto);
      expect(service.saveSignal).toHaveBeenCalledWith(createXrayDto);
      expect(result).toEqual(mockXray);
    });
  });

  describe('findAll', () => {
    it('should return all xray records', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockXray]);
    });
  });

  describe('findOne', () => {
    it('should return a single xray record', async () => {
      const result = await controller.findOne('some-id');
      expect(service.findById).toHaveBeenCalledWith('some-id');
      expect(result).toEqual(mockXray);
    });

    it('should throw NotFoundException if record not found', async () => {
      (service.findById as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an xray record', async () => {
      const updateXrayDto = { time: 1678972800000 };
      const result = await controller.update('some-id', updateXrayDto);
      expect(service.update).toHaveBeenCalledWith('some-id', updateXrayDto);
      expect(result).toEqual(mockXray);
    });
  });

  describe('remove', () => {
    it('should remove an xray record', async () => {
      await controller.remove('some-id');
      expect(service.remove).toHaveBeenCalledWith('some-id');
    });
  });

  describe('findFiltered', () => {
    it('should find filtered xray records', async () => {
      const result = await controller.findFiltered(
        'testDevice',
        1678886000000,
        1678887000000,
      );
      expect(service.findFiltered).toHaveBeenCalledWith(
        'testDevice',
        1678886000000,
        1678887000000,
      );
      expect(result).toEqual([mockXray]);
    });
  });
});
