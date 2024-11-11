import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { EnvironmentConfigService } from './infrastructure/config/environment-config/environment-config.service';
import { HttpExceptionFilter } from './infrastructure/config/filters/http-exception.filter';
import { CustomValidationPipe } from './infrastructure/config/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Service de variáveis de Ambiente
  const configService = app.get(EnvironmentConfigService);

  // Configurando Microservice
  const microserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [configService.getRabbitMqUrl()],
      queue: configService.getRabbitMqQueue(),
      queueOptions: {
        durable: true,
      },
    },
  };
  app.connectMicroservice(microserviceOptions);

  // Configurando Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway Auth')
    .setDescription(
      'API gateway para autenticação de serviço encurtador de url',
    )
    .addBearerAuth()
    .setVersion('0.8.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha', // Ordena as tags por ordem alfabética
    },
  });

  // Ativando o ValidationPipe como global
  app.useGlobalPipes(new CustomValidationPipe());

  // Configurando padrão de filtros de exceção htpt
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
