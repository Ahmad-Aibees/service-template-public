import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ArrayObjectIdPipe implements PipeTransform {
    constructor(private readonly title: string) {}

    transform(array: string): Types.ObjectId[] {
        try {
            if (array && array !== '') {
                const IDs: Types.ObjectId[] = [];

                const ids = JSON.parse(array);

                if (ids instanceof Array) {
                    ids.forEach((i) => {
                        if (!Types.ObjectId.isValid(i)) throw new BadRequestException('one of Ids is not valid');

                        IDs.push(Types.ObjectId(i));
                    });
                    return IDs;
                }

                throw new BadRequestException(`${this.title} is not valid`);
            }
        } catch (err) {
            throw new BadRequestException(`${this.title} is not valid`);
        }
    }
}
