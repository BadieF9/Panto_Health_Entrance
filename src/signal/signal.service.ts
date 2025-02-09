import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Xray } from 'src/schemas/x-ray.schema';

@Injectable()
export class SignalService {
  constructor(@InjectModel(Xray.name) private xrayModel: Model<Xray>) {}

  async saveSignal(xrayData: any): Promise<Xray> {
    try {
      const { deviceId, data, time } = xrayData;

      const dataLength = data.length;
      const dataVolume = JSON.stringify(data).length;

      const newXray = new this.xrayModel({
        deviceId,
        time,
        dataLength,
        dataVolume,
        data: data,
      });

      const savedXray = await newXray.save();
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

      if (!deviceId || !data || !time) {
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
}
