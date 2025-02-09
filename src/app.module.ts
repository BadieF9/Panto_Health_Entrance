import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { XrayModule } from './xray/xray.module';
import { SignalModule } from './signal/signal.module';
import { Xray, XraySchema } from './schemas/x-ray.schema';
import { SignalService } from './signal/signal.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/x-ray'),
    MongooseModule.forFeature([{ name: Xray.name, schema: XraySchema }]),
    XrayModule,
    SignalModule,
  ],
  controllers: [AppController],
  providers: [AppService, SignalService],
})
export class AppModule {}
