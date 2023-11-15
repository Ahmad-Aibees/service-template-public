import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { multipart } from './utility/multi-part';
import { IFile } from './utility/i-file';

/**
 * Binds files to array of {@link IFile}
 * @returns {@link IFile[]}
 */
export const BodyMultipartFiles = createParamDecorator(
    async (field: string, ctx: ExecutionContext): Promise<IFile> => {
        return await multipart.file(field, ctx);
    },
);
