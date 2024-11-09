import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Body,
  Headers,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout, retry, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Controller('api')
export class RabbitmqController {
  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private authService: AuthService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }



  @Get(':command')
  async sendGetMessage(
    @Param('command') command: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const user_id = this.authService.authDealing(authHeader);
    try {
      const result = this.client.send({ cmd: command }, { user_id }).pipe(
        timeout(50),
        retry(2),
        catchError((err) => {
          console.error('Error while sending message:', err);
          if(err?.statusCode){
            console.log(err)
            throw new HttpException(err,err?.statusCode)
          }
          return throwError(() => new Error('Failed to send message'));
        }),
      );

      return await lastValueFrom(result);
    } catch (error) {
      console.error(`Error sending command ${command}:`, error.message);
      throw error;
    }
  }

  @Get(':command/detail/:filter')
  async sendGetByIdMessage(
    @Param('command') command: string,
    @Param('filter') filter: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const user_id = this.authService.authDealing(authHeader);
    try {
      //Revalidar
      const result = this.client.send({ cmd: command }, { filter, user_id }).pipe(
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

  @Post(':command')
  async sendPostMessage(
    @Param('command') command: string,
    @Body() payload: object,
    @Headers('Authorization') authHeader: string,
  ) {
    const user_id = this.authService.authDealing(authHeader);
    try {
      const result = this.client.send({ cmd: command }, { ...payload, user_id }).pipe(
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

  @Put(':command')
  async sendPutMessage(
    @Param('command') command: string,
    @Body() payload: object,
    @Headers('Authorization') authHeader: string,
  ) {
    const user_id = this.authService.authDealing(authHeader);
    try {
      const result = this.client.send({ cmd: command }, { ...payload, user_id }).pipe(
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
