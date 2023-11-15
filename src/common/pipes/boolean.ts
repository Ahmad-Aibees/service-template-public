import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class BooleanPipe implements PipeTransform {
    constructor(private readonly title: string) {}

    transform(save: string): boolean {
        if (!save || save.toLowerCase() === 'true') return true;
        else if (save.toLowerCase() === 'false') return false;
        else throw new BadRequestException(`${this.title} is not valid`);
    }
}
