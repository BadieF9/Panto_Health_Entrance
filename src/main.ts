import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'x_ray_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  microservice.listen();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
