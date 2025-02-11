import { Test, TestingModule } from '@nestjs/testing';
import { SignalService } from './signal.service';
import { getModelToken } from '@nestjs/mongoose';
import { Xray } from '../schemas/x-ray.schema';
import { CreateXrayDto } from '../xray/dto/xray.dto';

describe('SignalService', () => {
  let service: SignalService;
  let model: any;

  const mockCoordinateSpeed: [number, number[]] = [
    1678886400000,
    [51.339764, 12.339223833333334, 1.2038000000000002],
  ];

  const mockXray: CreateXrayDto = {
    deviceId: 'testDevice',
    time: 1678886400000,
    data: [
      [1678886400000, [51.339764, 12.339223833333334, 1.2038000000000002]],
      [1678886401000, [51.34, 12.34, 1.3]],
    ],
  };

  const mockSavedXray: Xray = {
    _id: 'some-id',
    deviceId: 'testDevice',
    time: 1678886400000,
    data: [1234567890, [1234567890, mockCoordinateSpeed],
    ] as unknown,
    dataLength: 1,
    dataVolume: JSON.stringify([
      { time: 1234567890, coordinateSpeed: [mockCoordinateSpeed] },
    ]).length,
  } as Xray;

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
      create: jest.fn().mockResolvedValue(mockSavedXray),
      find: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalService,
        {
          provide: getModelToken(Xray.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<SignalService>(SignalService);
  });

  it('should save a signal', async () => {
    model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    model.create.mockResolvedValue(mockSavedXray);

    const savedSignal = await service.saveSignal(mockXray);

    expect(model.findOne).toHaveBeenCalledWith({ deviceId: mockXray.deviceId });
    expect(model.create).toHaveBeenCalledWith({
      ...mockXray,
      dataLength: mockXray.data.length,
      dataVolume: JSON.stringify(mockXray.data).length,
    });
    expect(savedSignal).toEqual(mockSavedXray);
  });

  it('should throw an error if signal already exists', async () => {
    model.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockSavedXray),
    }); // Mock WITHIN the test
    await expect(service.saveSignal(mockXray)).rejects.toThrow(
      'Signal already exists',
    );
  });

  it('should process x-ray data', () => {
    const message = JSON.stringify({
      testDevice: { data: mockXray.data, time: mockXray.time },
    });

    const processedData = service.processXrayData(message);

    expect(processedData).toEqual(mockXray);
  });

  it('should throw an error for invalid x-ray data format', () => {
    const invalidMessage = JSON.stringify({ invalid: 'data' });

    expect(() => service.processXrayData(invalidMessage)).toThrow(
      'Invalid x-ray data format. Missing deviceId, data, or time.',
    );
  });

  it('should find all signals', async () => {
    const mockXrays: Xray[] = [
      {
        deviceId: 'device1',
        time: 1678886400000,
        data: [],
        dataLength: 0,
        dataVolume: 0,
      },
    ];
    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockXrays),
    });

    const foundXrays = await service.findAll();

    expect(model.find).toHaveBeenCalled();
    expect(foundXrays).toEqual(mockXrays);
  });

  it('should find a signal by ID', async () => {
    const mockXray = {
      _id: 'some-id',
      deviceId: 'device1',
      time: 1678886400000,
      data: [[1678886400000, [1, 2, 3]]],
      dataLength: 1,
      dataVolume: JSON.stringify([[1678886400000, [1, 2, 3]]]).length,
    };

    model.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockXray),
    });

    const foundXray = await service.findById('some-id');

    expect(model.findById).toHaveBeenCalledWith('some-id');
    expect(foundXray).toEqual(mockXray);
  });

  it('should update a signal', async () => {
    const updateData = { time: 1678972800000 };
    const updatedXray = { ...mockSavedXray, ...updateData };

    model.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedXray),
    });

    const result = await service.update('some-id', updateData);

    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      'some-id',
      updateData,
      { new: true },
    );
    expect(result).toEqual(updatedXray);
  });

  it('should remove a signal', async () => {
    await service.remove('some-id');
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('some-id');
  });

  it('should find filtered signals', async () => {
    const filter = {
      deviceId: 'testDevice',
      time: { $gte: 1678886400000, $lte: 1678972800000 },
    };

    const mockXrays: Xray[] = [mockSavedXray];

    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockXrays),
    });

    const foundXrays = await service.findFiltered(
      'testDevice',
      1678886400000,
      1678972800000,
    );

    expect(model.find).toHaveBeenCalledWith(filter);
    expect(foundXrays).toEqual(mockXrays);
  });

  it('should find filtered signals by deviceId', async () => {
    const filter = { deviceId: 'testDevice' };
    const mockXrays: Xray[] = [mockSavedXray];

    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockXrays),
    });

    const foundXrays = await service.findFiltered('testDevice');

    expect(model.find).toHaveBeenCalledWith(filter);
    expect(foundXrays).toEqual(mockXrays);
  });

  it('should find filtered signals by startTime', async () => {
    const filter = { time: { $gte: 1678886400000 } };
    const mockXrays: Xray[] = [mockSavedXray];

    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockXrays),
    });

    const foundXrays = await service.findFiltered(undefined, 1678886400000);

    expect(model.find).toHaveBeenCalledWith(filter);
    expect(foundXrays).toEqual(mockXrays);
  });

  it('should find filtered signals by endTime', async () => {
    const filter = { time: { $lte: 1678972800000 } };
    const mockXrays: Xray[] = [mockSavedXray];

    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockXrays),
    });

    const foundXrays = await service.findFiltered(
      undefined,
      undefined,
      1678972800000,
    );

    expect(model.find).toHaveBeenCalledWith(filter);
    expect(foundXrays).toEqual(mockXrays);
  });
});
