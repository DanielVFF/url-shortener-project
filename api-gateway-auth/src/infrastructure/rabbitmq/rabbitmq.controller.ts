import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout, retry, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Controller('rabbitmq')
export class RabbitmqController {
  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Get(':command')
  async sendMessage(@Param('command') command: string) {
    console.log(`Sending command: ${command}`);
    try {
      const result = this.client
        .send({ cmd: command }, { data: 'Hello from Gateway' })
        .pipe(
          timeout(5000),
          retry(2), 
          catchError((err) => {
            console.error('Error while sending message:', err);
            return throwError(() => new Error('Failed to send message'));
          }),
        );
      return await lastValueFrom(result);
    } catch (error) {
      console.error(`Error sending command ${command}:`, error.message);
      throw error;
    }
  }
}
