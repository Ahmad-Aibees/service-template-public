import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { QueryFieldInterface, QueryInterface, QueryOperators, QueryOperatorsTypes } from './interface/query';

@Injectable()
export class QueryFilterPipe implements PipeTransform {
    private filter: { [key: string]: any } = {};

    constructor(private readonly query: QueryInterface) {}

    private setQuery(field: string, condition: { [key: string]: any }) {
        if (this.filter[field] === undefined) this.filter[field] = {};

        const key: string = Object.keys(condition)[0];
        this.filter[field][key] = condition[key];
    }

    private getIDs(IDs: string | string[]) {
        if (typeof IDs === 'string') return Types.ObjectId.isValid(IDs) ? Types.ObjectId(IDs) : null;
        return IDs.filter((ID: string) => Types.ObjectId.isValid(ID)).map((ID: string) => Types.ObjectId(ID));
    }

    transform(filter: string): { [key: string]: any } {
        let filterObj: any = null;
        try {
            filterObj = filter ? JSON.parse(filter) : null;
        } catch (e) {
            // console.log(e);
        }
        if (!filterObj || Object.keys(filterObj).length === 0) return {};

        this.filter = {};
        Object.keys(filterObj).forEach((k) => {
            if (!this.query[k]) return;
            const filterItem = filterObj[k];
            const field: QueryFieldInterface = this.query[k];

            Object.keys(filterItem).forEach((operator: QueryOperatorsTypes) => {
                if (!QueryOperators[operator]?.includes(field.type)) return;

                if (field.type === 'ID') filterItem[operator] = this.getIDs(filterItem[operator]);

                switch (operator) {
                    case 'EQ': // equal
                        if (field.type === 'status') {
                            if (filterItem[operator] === true) this.setQuery('deactived', { $ne: true });
                            if (filterItem[operator] === false) this.setQuery('deactived', { $eq: true });
                        } else this.setQuery(field.schema, { $eq: filterItem[operator] });
                        break;

                    case 'NE': // not equal
                        this.setQuery(field.schema, { $ne: filterItem[operator] });
                        break;

                    case 'IN': // exist in
                        this.setQuery(field.schema, { $in: filterItem[operator] });
                        break;

                    case 'SC': // search
                        const search: string = String(filterItem[operator]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        this.setQuery(field.schema, { $regex: new RegExp('.*' + search + '.*', 'i') });
                        break;

                    case 'AF': // after
                        const after: Date = new Date(filterItem[operator]);
                        if (!isNaN(after.getTime())) this.setQuery(field.schema, { $gt: after });
                        break;

                    case 'BF': // before
                        const before: Date = new Date(filterItem[operator]);
                        if (!isNaN(before.getTime())) this.setQuery(field.schema, { $lt: before });
                        break;

                    case 'GT': // great
                        this.setQuery(field.schema, { $gt: filterItem[operator] });
                        break;

                    case 'GE': // greater than
                        this.setQuery(field.schema, { $gte: filterItem[operator] });
                        break;

                    case 'LT': // less than
                        this.setQuery(field.schema, { $lt: filterItem[operator] });
                        break;

                    case 'LE': // less than equal
                        this.setQuery(field.schema, { $lte: filterItem[operator] });
                        break;

                    case 'EX': // exist
                        this.setQuery(field.schema, { $exists: filterItem[operator] });
                        break;

                    case 'EM': //elemMatch
                        //{ campaigns: { $elemMatch: { name: { $regex: new RegExp('.*' + 'sa' + '.*', 'i') } } } };
                        const schema = field.schema.split('.');
                        const title = schema[0];
                        const subTitle = schema[1];

                        const elem = { $elemMatch: {} };
                        const src: string = String(filterItem[operator]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        elem.$elemMatch[subTitle] = { $regex: new RegExp('.*' + src + '.*', 'i') };

                        this.setQuery(title, elem);
                }
            });
        });

        return this.filter;
    }
}
