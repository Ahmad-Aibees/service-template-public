import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class NullableObjectIdPipe implements PipeTransform {
    constructor(private readonly title: string) {}

    transform(ID: string): Types.ObjectId {
        if (!ID || Types.ObjectId.isValid(ID)) return ID ? Types.ObjectId(ID) : null;

        throw new BadRequestException(`${this.title} is not valid`);
    }
}
