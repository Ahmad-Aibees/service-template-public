import * as formidable from 'formidable';
import * as _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';
import { IFile } from './i-file';
import { FormDataParser } from '../form-data/form-data-parser';

class Multipart {
    private formDataParser: FormDataParser;

    constructor() {
        this.formDataParser = new FormDataParser();
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    has(o: object, field: string) {
        return !_.isNil(o[field]);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    getField(req, field: string): object {
        // multi-part fields
        if (this.has(req.multiFields, field)) {
            return req.multiFields[field];
        }
        // body
        if (this.has(req.body, field)) {
            return req.body[field];
        }
        // query
        if (this.has(req.query, field)) {
            return req.query[field];
        }
        // params
        if (this.has(req.params, field)) {
            return req.params[field];
        }
        return null;
    }

    parseForm(req: Request): Promise<any | Error> {
        return new Promise((resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    // console.log(err);
                    reject(err);
                    return;
                }
                resolve({ fields, files });
            });
        });
    }

    async ensureMultipart(req: any): Promise<void> {
        if (_.isEmpty(req.multiFields) && _.isEmpty(req.multiFiles)) {
            const { fields, files } = await this.parseForm(req);
            req.multiFields = this.formDataParser.parse(fields);
            req.multiFiles = this.formDataParser.parse(files);
        }
    }

    async data(field: string, ctx: ExecutionContext): Promise<any> {
        const req = ctx.switchToHttp().getRequest();
        await this.ensureMultipart(req);
        return this.getField(req, field);
    }

    async multiple_data(fields: string[], ctx: ExecutionContext): Promise<any> {
        const req = ctx.switchToHttp().getRequest();
        await this.ensureMultipart(req);
        // eslint-disable-next-line @typescript-eslint/ban-types
        const res: object = {};
        fields.forEach((f) => {
            res[f] = this.getField(req, f);
        });
        return res;
    }

    async multiple_data_typed<T>(res: T, fields: string[], ctx: ExecutionContext): Promise<void> {
        const req = ctx.switchToHttp().getRequest();
        await this.ensureMultipart(req);
        fields.forEach((f) => {
            res[f] = this.getField(req, f);
        });
    }

    async file(field: string, ctx: ExecutionContext): Promise<IFile> {
        const req = ctx.switchToHttp().getRequest();
        await this.ensureMultipart(req);
        // multi-part files
        if (this.has(req.multiFiles, field)) {
            return req.multiFiles[field];
        }
        return null;
    }
}

const multipart = new Multipart();
export { multipart };
