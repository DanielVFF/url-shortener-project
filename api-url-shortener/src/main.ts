import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { CustomValidationPipe } from './infrastructure/config/pipes/custom-validation.pipe';
import { RpcValidationFilter } from './infrastructure/config/filters/rpcfilter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'api_gateway_queue',
      queueOptions: {
        durable: true,
      },
    },
  });


  // Ativando o Filter como global
  app.useGlobalFilters(new RpcValidationFilter());

  await app.listen();
}
bootstrap();
