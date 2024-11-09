import { Global, Module } from '@nestjs/common';
import { EnvironmentConfigService } from './environment-config.service';
import { ConfigService } from '@nestjs/config';

//Definido como global para conseguir puxar variáveis dentro da inicialização de um módulo
@Global()
@Module({
  providers: [EnvironmentConfigService, ConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
