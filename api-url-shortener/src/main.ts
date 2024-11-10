import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { RpcValidationFilter } from './infrastructure/config/filters/rpcfilter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      // Como é um microserviço, ainda não achei uma maneira de chamar o EnviromnentService aqui
      urls: [process.env.RABBITMQ_URL],
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
