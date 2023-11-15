import { woodpeckerWebHookCallbackType, woodpeckerWebHookCallbackTypeList } from './../types/woodpecker-web-hook-callback-type';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class WoodpeckerCallbackMethodPipe implements PipeTransform {
    constructor(private readonly title: string) {}

    transform(method: string): woodpeckerWebHookCallbackType {
        if (woodpeckerWebHookCallbackTypeList.includes(method)) return <woodpeckerWebHookCallbackType>method;

        throw new BadRequestException(`${this.title} is not valid`);
    }
}
