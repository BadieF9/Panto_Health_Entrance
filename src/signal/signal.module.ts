import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Xray, XraySchema } from 'src/schemas/x-ray.schema';
import { SignalService } from './signal.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Xray.name, schema: XraySchema }]),
  ],
  providers: [SignalService],
  exports: [SignalService],
})
export class SignalModule {}
