import { Controller, Get } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('')
export class AppController {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'microservice_queue',
      queueOptions: {
        durable: true,
      },
    },
  })
  private client: ClientProxy;

  @Get('send-message')
  async sendMessage() {
    const result = this.client.send(
      { cmd: 'process_data' },
      { data: 'Hello from Gateway' },
    );
    return lastValueFrom(result);
  }
}
