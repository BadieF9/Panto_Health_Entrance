import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { XrayModule } from './xray/xray.module';
import { SignalModule } from './signal/signal.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/x-ray'),
    XrayModule,
    SignalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
