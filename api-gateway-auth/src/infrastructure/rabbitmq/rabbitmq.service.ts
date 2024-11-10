import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, retry, throwError, timeout } from 'rxjs';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

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
