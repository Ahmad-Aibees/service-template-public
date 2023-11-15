import { Injectable, PipeTransform } from '@nestjs/common';
import { QueryInterface } from './interface/query';

@Injectable()
export class QuerySwaggerPipe implements PipeTransform {
    constructor(private readonly query: QueryInterface, private readonly type: 'filter' | 'sort') {}

    transform(): { [key: string]: any } {
        switch (this.type) {
            case 'filter':
                return {
                    type: String,
                    required: false,
                    description: 'filter',
                    example: Object.keys(this.query).join(' - '),
                };

            case 'sort':
                return {
                    type: String,
                    required: false,
                    description: 'sort',
                    example: Object.keys(this.query)
                        .filter((k: string) => this.query[k].sort)
                        .join(' - '),
                };
        }
    }
}
