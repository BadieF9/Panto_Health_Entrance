import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Xray, XraySchema } from 'src/schemas/x-ray.schema';
import { XrayController } from './xray.controller';
import { SignalService } from 'src/signal/signal.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Xray.name, schema: XraySchema }]),
  ],
  providers: [SignalService],
  controllers: [XrayController],
})
export class XrayModule {}
