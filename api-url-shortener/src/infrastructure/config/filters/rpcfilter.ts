import {
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const response = exception.getResponse();
    if (response instanceof RpcException) {
      return response.getError();
    }
    return response;
  }
}
