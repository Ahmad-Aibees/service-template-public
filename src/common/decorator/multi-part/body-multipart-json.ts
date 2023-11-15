import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';
import { multipart } from './utility/multi-part';

export const BodyMultipartJson = createParamDecorator(
    async (data: { type: any, field: string }, ctx: ExecutionContext) => {
        const o = new data.type();
        const json = await multipart.data(data.field, ctx);
        const x = JSON.parse(json);
        return _.extend(o, x);
    },
);