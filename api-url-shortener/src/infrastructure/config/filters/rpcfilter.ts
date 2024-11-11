import {
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 * Filtro de exceção para lidar com erros de validação em chamadas RPC (Remote Procedure Call).
 * 
 * Este filtro intercepta exceções do tipo `HttpException` e, se a resposta contiver uma 
 * instância de `RpcException`, ela retorna o erro associado. Caso contrário, retorna 
 * a resposta original da exceção.
 */
@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
  /**
   * Captura e processa a exceção HTTP, verificando se ela contém um erro de RPC.
   * 
   * Se a exceção for do tipo `RpcException`, retorna o erro associado a ela. 
   * Caso contrário, retorna a resposta original da exceção.
   * 
   * @param exception - A exceção `HttpException` que foi lançada.
   * @returns O erro contido na `RpcException`, caso seja o tipo correto, ou a resposta original.
   */
  catch(exception: HttpException) {
    // Obter a resposta da exceção
    const response = exception.getResponse();

    // Verificar se a resposta é uma instância de RpcException e retornar o erro
    if (response instanceof RpcException) {
      return response.getError();
    }

    // Caso contrário, retorna a resposta original da exceção
    return response;
  }
}
