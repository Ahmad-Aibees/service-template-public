import { Injectable, PipeTransform } from '@nestjs/common';
import { QueryInterface } from './interface/query';

@Injectable()
export class QuerySortPipe implements PipeTransform {
    private sort: { [key: string]: number } = {};

    constructor(private readonly query: QueryInterface) {}

    transform(sort: string): { [key: string]: any } {
        let fields: any = null;
        try {
            fields = sort ? JSON.parse(sort) : null;
        } catch (e) {}
        if (!fields || Object.keys(fields).length === 0) return {};

        this.sort = {};
        Object.keys(fields).forEach((k) => {
            if (!this.query[k] || this.query[k].sort !== true || !this.query[k].schema) return;
            if (!['ASC', 'DESC'].includes(fields[k])) return;
            this.sort[this.query[k].schema] = fields[k] === 'ASC' ? 1 : -1;
        });

        return this.sort;
    }
}
