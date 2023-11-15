import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { bindMultipartClass } from './utility/bind-multipart-class';

export const BodyMultipartClassFields = createParamDecorator(
    async (data: { type: any, fields: string[] }, ctx: ExecutionContext) => {
        const fieldArray = data.fields ?? Object.keys(new data.type());
        return await bindMultipartClass(data.type, fieldArray, ctx);
    },
);