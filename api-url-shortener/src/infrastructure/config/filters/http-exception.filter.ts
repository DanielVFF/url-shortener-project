import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de exceções para capturar e formatar erros do tipo `HttpException`.
 * 
 * Este filtro pega as exceções lançadas do tipo `HttpException` e as formata em uma resposta JSON,
 * contendo o código de status, timestamp, caminho da requisição e a mensagem de erro.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Captura e formata a exceção `HttpException`.
   * 
   * @param exception - A exceção `HttpException` que foi lançada.
   * @param host - O contexto da exceção, utilizado para obter a requisição e resposta.
   * 
   * @returns Retorna uma resposta HTTP formatada com o status, timestamp, caminho e mensagem de erro.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    // Obter o contexto da requisição e resposta
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Obter o status da exceção
    const status = exception.getStatus();

    // Obter a resposta da exceção, que pode ser uma string ou objeto com a mensagem
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message: string }).message;

    // Enviar uma resposta JSON com os detalhes da exceção
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
