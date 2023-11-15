import * as fs from 'fs';
import { ErrorHelper } from './error-helper';
import { RoleType } from '../types/role-type';
import { EncryptionHelper } from './encryption-helper';
import { UrlModel } from '../../model/database/model/url';
import { createReadStream } from 'fs';
import { Stream } from 'stream';

export class FileHelper {
    static async getFileSize(url: string): Promise<string> {
        if (!await fs.existsSync(url)) ErrorHelper.notFound('file not found!');
        const stats = await fs.statSync(url);
        return `${stats.size / 1000000.0} MB`;
    }

    static async getFileExt(url: string, name: string): Promise<string> {
        if (!await fs.existsSync(url)) ErrorHelper.notFound('file not found!');
        const array = name.split('.')
        return array[array.length - 1];
    }

    static async exists(url: string): Promise<boolean> {
        return fs.existsSync(url);
    }

    static getName(url: string): string {
        return url.split('\\').pop().split('/').pop();
    }

    static createDownloadUrl(urlModel: UrlModel) {
        return EncryptionHelper.encrypt(`${urlModel._id.toHexString()}:${urlModel.access.role}:${urlModel.access.id.toHexString()}`);
    }

    static decryptFileToken(fileToken: string): { urlId: string, role: RoleType, userId: string } {
        const result = EncryptionHelper.decrypt(fileToken).split(':');
        return Object({
            urlId: result[0],
            role: result[1],
            userId: result[2]
        })
    }

    static async getFile(path: string): Promise<Stream> {
        if (!(await fs.existsSync(path))) ErrorHelper.notFound('file not found!');

        return createReadStream(path);
    }
}
