import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * Um pipe customizado para validar objetos de entrada em requisições.
 * 
 * Este pipe utiliza o `class-validator` para validar a entrada baseada nos DTOs (Data Transfer Objects).
 * Caso ocorra algum erro de validação, ele lança uma exceção HTTP com a mensagem de erro e código de status 422.
 */
@Injectable()
export class CustomValidationPipe implements PipeTransform<object> {
  /**
   * Transforma e valida a entrada, caso necessário.
   * 
   * A entrada será validada apenas se o metatype for um tipo válido. Se a validação falhar, um erro HTTP será lançado.
   * 
   * @param value - O valor a ser validado.
   * @param metadata - Metadados da requisição, incluindo o tipo (metatype) do valor.
   * @returns O valor original, se a validação for bem-sucedida.
   * @throws HttpException - Caso a validação falhe, uma exceção HTTP com código 422 será lançada.
   */
  async transform(value: object, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const firstError = errors[0].constraints;
      throw new HttpException(
        {
          message: Object.values(firstError)[0],
          statusCode: 422,
        },
        422,
      );
    }

    return value;
  }

  /**
   * Verifica se o tipo fornecido deve ser validado.
   * 
   * Tipos como `String`, `Boolean`, `Number`, `Array` e `Object` não são validados.
   * 
   * @param metatype - O tipo da entrada a ser validado.
   * @returns Verdadeiro se o tipo deve ser validado, falso caso contrário.
   */
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
