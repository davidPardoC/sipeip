import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9094'],
        },
        consumer: {
          groupId: 'sipeip_logger',
        },
      },
    },
  );

  const api = await NestFactory.create(AppModule);
  api.setGlobalPrefix('/api/logger');

  await Promise.all([app.listen(), api.listen(5500)]);
  console.log('Logger service is running on port 5500');
}

bootstrap();
