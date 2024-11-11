import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<object> {
  /**
   * Transforma e valida o valor recebido de acordo com o tipo de metadado.
   * @param value - Objeto a ser validado.
   * @param metadata - Metadados do argumento, incluindo o tipo de dado.
   * @returns O valor original se não houver erros de validação.
   * @throws HttpException - Se houver erros de validação, lançará uma exceção com o primeiro erro encontrado e um status 422.
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
   * Determina se o tipo do metadado deve ser validado.
   * @param metatype - Tipo do metadado a ser verificado.
   * @returns Retorna true se o tipo do metadado é validável (não é um tipo primitivo).
   */
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
