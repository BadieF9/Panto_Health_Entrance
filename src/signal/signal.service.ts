import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Xray } from '../schemas/x-ray.schema';
import { CreateXrayDto } from '../xray/dto/xray.dto';

@Injectable()
export class SignalService {
  constructor(@InjectModel(Xray.name) private xrayModel: Model<Xray>) {}

  async saveSignal(xrayData: CreateXrayDto): Promise<Xray> {
    try {
      const xray = await this.xrayModel
        .findOne({ deviceId: xrayData.deviceId })
        .exec();
      if (xray) {
        throw new ConflictException('Signal already exists');
      }

      const { deviceId, data, time } = xrayData;

      const dataLength = data.length;
      const dataVolume = JSON.stringify(data).length;

      const savedXray = await this.xrayModel.create({
        deviceId,
        time,
        dataLength,
        dataVolume,
        data: data,
      });

      return savedXray;
    } catch (error) {
      console.error('Error saving signal:', error);
      throw error;
    }
  }

  processXrayData(message: any): any {
    try {
      const xrayData = JSON.parse(message);

      const deviceId = Object.keys(xrayData)[0];
      const data = xrayData[deviceId].data;
      const time = xrayData[deviceId].time;

      if (
        !deviceId ||
        !data ||
        !time
      ) {
        throw new Error(
          'Invalid x-ray data format. Missing deviceId, data, or time.',
        );
      }

      return { deviceId, data, time };
    } catch (error) {
      console.error('Error processing x-ray data:', error);
      throw error;
    }
  }

  async findAll(): Promise<Xray[]> {
    return this.xrayModel.find().exec();
  }

  async findById(id: string): Promise<Xray> {
    return this.xrayModel.findById(id).exec();
  }

  async update(
    id: string,
    updateXrayDto: Partial<CreateXrayDto>,
  ): Promise<Xray> {
    try {
      return this.xrayModel
        .findByIdAndUpdate(id, updateXrayDto, { new: true })
        .exec();
    } catch (error) {
      throw new NotFoundException('Xray not found');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.xrayModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new NotFoundException('Xray not found');
    }
  }

  async findFiltered(
    deviceId?: string,
    startTime?: number,
    endTime?: number,
  ): Promise<Xray[]> {
    const filter: any = {};

    if (deviceId) {
      filter.deviceId = deviceId;
    }
    if (startTime && endTime) {
      filter.time = { $gte: startTime, $lte: endTime };
    } else if (startTime) {
      filter.time = { $gte: startTime };
    } else if (endTime) {
      filter.time = { $lte: endTime };
    }

    return this.xrayModel.find(filter).exec();
  }
}
