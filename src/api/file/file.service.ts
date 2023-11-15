import {Injectable, NotAcceptableException} from '@nestjs/common';
import {ApiFileUploadRs} from './rq-rs/upload';
import {IFile} from '../../common/decorator/multi-part/utility/i-file';
import {Identity} from '../../application/auth/models/identity';
import {Types} from 'mongoose';
import {ApiCreateUrlRs} from './rq-rs/ApiCreateUrlRs';
import {FileMsService} from "../../model/micro-service/file-ms.service";
import {FileType, FileTypeEnum} from "../../common/types/file-type";
import {Request} from "express";
import * as fs from "fs";
import * as path from "path";
import {RandomKeyHelper} from "../../common/helpers/random-key-helper";
import {FileHelper} from "../../common/helpers/file-helper";
import {ErrorHelper} from "../../common/helpers/error-helper";

@Injectable()
export class FileService {
    constructor(
        private readonly fileMsService: FileMsService
    ) {
    }

    getDirectoryFile(type: FileType): string {
        return process.env.temp_file_directory;
    }

    private async getFileExt(file: any): Promise<string> {
        return FileHelper.getFileExt(file?.path, file?.name);
    }

    async moveFilesToLocalStorage(file: { fullPath: string; extension?: string; mimeType?: string; directory: string }): Promise<string> {
        let res: string;
        const dir = file.directory;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (file) {
            const destFileName = `${RandomKeyHelper.create(24, RandomKeyHelper.alphaNumeric)}.${file.extension}`;
            const destFile = path.join(dir, destFileName);
            if (fs.existsSync(file.fullPath)) {
                fs.copyFileSync(file.fullPath, destFile);
                fs.unlinkSync(file.fullPath);
            }
            res = destFile;
        }
        return res;
    }

    public async upload(type: FileType, identity: Identity, file: IFile, req: Request): Promise<ApiFileUploadRs> {
        if (!file) ErrorHelper.badRequest('not_found_file');

        const ext = await this.getFileExt(file);
        const fileRestrictionsRecord = FileTypeEnum[type].find((i) => {
            return i.ext?.includes(ext);
        });
        if (!fileRestrictionsRecord) throw new NotAcceptableException('not_accepted_fileExt');
        if (file.size / (1024 * 1024) > fileRestrictionsRecord.maxSize) {
            ErrorHelper.notAcceptable(`file size is upper than ${fileRestrictionsRecord.maxSize / 1000} KB`);
        }

        const directory = this.getDirectoryFile(type);

        const filePaths = await this.moveFilesToLocalStorage({
            extension: ext,
            mimeType: file.type,
            fullPath: file.path,
            directory
        });

        const results = await this.fileMsService.uploadFile(identity.userId, type, filePaths, req);
        await fs.unlinkSync(filePaths);
        return results;
    }

    async download(fileToken: string, req: Request): Promise<void> {
        await this.fileMsService.downloadFile(fileToken, req);
    }

    async createUrl(fileId: Types.ObjectId, userId: Types.ObjectId, req: Request): Promise<ApiCreateUrlRs> {
        return this.fileMsService.getUrlToken(fileId.toHexString(), userId, req);
    }
}
