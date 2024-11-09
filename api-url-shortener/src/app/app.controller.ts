import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'process_data' })
  handleMessage(data: any) {
    return { response: 'Message processed' };
  }
}
