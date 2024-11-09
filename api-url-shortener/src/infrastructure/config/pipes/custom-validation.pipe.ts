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

  //Infelizmente, metatype é Type<Any> até mesmo dentro do @nestjs/common, seguindo a tipagem de ArgumentMetadata
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
