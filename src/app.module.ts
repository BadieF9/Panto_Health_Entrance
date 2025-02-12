import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { XrayModule } from './xray/xray.module';
import { SignalModule } from './signal/signal.module';
import { Xray, XraySchema } from './schemas/x-ray.schema';
import { SignalService } from './signal/signal.service';
import { ProducerModule } from './producer/producer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([{ name: Xray.name, schema: XraySchema }]),
    XrayModule,
    SignalModule,
    ProducerModule,
  ],
  controllers: [AppController],
  providers: [SignalService],
})
export class AppModule {}
