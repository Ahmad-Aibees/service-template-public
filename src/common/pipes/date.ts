import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ValidationString } from '../validator/interface/validations/string';

@Injectable()
export class DatePipe implements PipeTransform {
    private validationString = new ValidationString();

    constructor(private readonly title: string) {}

    transform(date: string): Date {
        if (this.validationString.isJsonDate(date)) return date ? new Date(date) : null;

        throw new BadRequestException(`${this.title} is not valid!`);
    }
}
