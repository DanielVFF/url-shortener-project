import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'api_gateway_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('API Gateway Auth')
    .setDescription(
      'API gateway para autênticação de serviço encurtador de url',
    )
    .setVersion('0.1.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
