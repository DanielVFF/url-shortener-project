import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Captura exceções do tipo HttpException e formata a resposta JSON.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Manipula uma exceção e envia uma resposta JSON customizada com o status da exceção,
   * mensagem de erro, URL da requisição e timestamp.
   * 
   * @param {HttpException} exception - A exceção capturada, do tipo HttpException.
   * @param {ArgumentsHost} host - O objeto de contexto do NestJS que permite
   * acessar a requisição e resposta HTTP.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message: string }).message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
