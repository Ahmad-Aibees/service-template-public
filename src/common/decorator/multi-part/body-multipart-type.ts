import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';
import { ObjectId } from 'mongodb';
import { ErrorHelper } from '../../helpers/error-helper';
import { multipart } from './utility/multi-part';

export const BodyMultipartType = createParamDecorator(
    async (
        data: {
            field: string;
            type: 'string' | 'number' | 'boolean' | 'objectId' | 'enum';
            required?: boolean;
            title?: string;
            enum?: any[] | Record<string, any>;
        },
        ctx: ExecutionContext,
    ) => {
        const value = await multipart.data(data.field, ctx);

        if (data.required && _.isNil(value)) {
            ErrorHelper.badRequest(`${data.title} is invalid.`);
        }

        switch (data.type) {
            case 'string':
                return value;
            case 'number':
                if (typeof value === 'number') {
                    return value;
                }
                return Number(value);
            case 'boolean':
                if (typeof value === 'number') {
                    return value !== 0;
                }
                if (!value) {
                    return false;
                }
                return value.toString().toLowerCase() === 'true';
            case 'objectId':
                if (!value) {
                    return null;
                }
                return new ObjectId(value);
            case 'enum':
                if (!data.enum || !Object.values(data.enum).includes(value)) {
                    ErrorHelper.badRequest(`${data.title} is invalid.`);
                }
                return value;
        }
    },
);
