import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { EnvironmentConfigService } from './infrastructure/config/environment-config/environment-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvironmentConfigService);

  const microserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [configService.getRabbitMqUrl()], // Usando a URL de forma centralizada
      queue: configService.getRabbitMqQueue(),
      queueOptions: {
        durable: true,
      },
    },
  };

  app.connectMicroservice(microserviceOptions);

  const config = new DocumentBuilder()
    .setTitle('API Gateway Auth')
    .setDescription(
      'API gateway para autenticação de serviço encurtador de url',
    )
    .setVersion('0.1.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
