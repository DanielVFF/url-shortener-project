import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, retry, throwError, timeout } from 'rxjs';

@Injectable()
export class RabbitmqService {
  /**
   * Construtor da classe RabbitmqService.
   * @param client - O cliente do RabbitMQ usado para enviar mensagens.
   */
  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  /**
   * Conecta ao serviço RabbitMQ quando o módulo é inicializado.
   */
  async onModuleInit() {
    await this.client.connect();
  }

  /**
   * Envia uma mensagem para o serviço RabbitMQ.
   * 
   * Este método envia uma mensagem com um comando e payload para o serviço RabbitMQ, com suporte a retries e timeout.
   * Caso o envio falhe, ele tentará novamente (com o número de retries definido).
   * 
   * @param command - O comando que está sendo enviado.
   * @param payload - O payload da mensagem que será enviado.
   * @param user_id - O ID do usuário para associar à mensagem.
   * @param timeoutDuration - O tempo máximo de espera pela resposta antes de considerar a operação como falha. Padrão: 5000ms.
   * @param retries - O número de tentativas de reenvio em caso de falha. Padrão: 2.
   * 
   * @returns A resposta do serviço RabbitMQ, ou lança uma exceção se ocorrer um erro.
   * 
   * @throws HttpException - Lançada em caso de erro na mensagem ou na comunicação com o serviço.
   */
  public async sendMessage(
    command: string,
    payload: object,
    user_id: string,
    timeoutDuration: number = 5000,
    retries: number = 2,
  ) {
    try {
      const result = this.client
        .send({ cmd: command }, { ...payload, user_id })
        .pipe(
          timeout(timeoutDuration),
          retry(retries),
          catchError((err) => {
            console.error('Erro ao enviar a mensagem:', err);
            if (err?.statusCode) {
              throw new HttpException(err.message, err.statusCode);
            }
            return throwError(() => new Error('falha ao enviar a mensagem'));
          }),
        );

      const response = await lastValueFrom(result);
      if (response?.statusCode && ![200, 201].includes(response.statusCode)) {
        throw new HttpException(response.message, response.statusCode);
      }
      return response;
    } catch (error) {
      console.error(`Error sending command ${command}:`, error.message);
      throw error;
    }
  }
}
