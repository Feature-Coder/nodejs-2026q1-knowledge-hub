import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { MESSAGES } from './messages';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  constructor(private readonly paramName: string) {}

  transform(value: any) {
    if (!isUUID(value)) {
      throw new BadRequestException(MESSAGES.INVALID_UUID(this.paramName));
    }
    return value;
  }
}
