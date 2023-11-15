import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { bindMultipartClass } from './utility/bind-multipart-class';

export const BodyMultipartClass = createParamDecorator(
    async (data: { type: any }, ctx: ExecutionContext) => {
        const fieldArray = Object.keys(new data.type());
        return await bindMultipartClass(data.type, fieldArray, ctx);
    },
);