import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
    constructor(private readonly title: string) {}

    transform(ID: string): Types.ObjectId {
        if (Types.ObjectId.isValid(ID)) return Types.ObjectId(ID);

        throw new BadRequestException(`${this.title} is not valid`);
    }
}
