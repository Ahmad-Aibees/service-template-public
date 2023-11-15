import {MicroServiceService} from "./micro-service.service";
import {Injectable} from "@nestjs/common";
import {ApiFileUploadRs} from "../../api/file/rq-rs/upload";
import {Types} from "mongoose";
import {ApiCreateUrlRs} from "../../api/file/rq-rs/ApiCreateUrlRs";
import {FileType} from "../../common/types/file-type";
import {isError} from "@nestjs/cli/lib/utils/is-error";
import {Request, Response} from "express";
import {IFile} from "../../common/decorator/multi-part/utility/i-file";

@Injectable()
export class FileMsService extends MicroServiceService {
    // async forwardFileUpload(req: Request): Promise<ApiFileUploadRs> {
    //
    // }

    async uploadFile(actorId: Types.ObjectId, fileType: FileType, filePaths: string, req: Request): Promise<ApiFileUploadRs> {
        const result = await this.request('file-service', '/file', 'POST', {
            fileType, actorId: actorId.toHexString()
        }, undefined, undefined, filePaths, req);

        if (isError(result))
            throw result;

        return {
            fileIds: result.fileIds,
        };
    }

    async getUrlToken(fileId: string, actorId: Types.ObjectId, req: Request): Promise<ApiCreateUrlRs> {
        const results = await this.request('file-service', '/file/create-token/:fileId/:actorId', 'GET', undefined, { fileId, actorId: actorId?.toHexString() }, undefined, undefined, req);

        if (isError(results)) throw results;

        return results as ApiCreateUrlRs;
    }

    async downloadFile(fileToken: string, req: Request): Promise<void> {
        await this.request('file-service', '/file/:fileToken', 'GET', undefined, { fileToken }, undefined, undefined, req);
    }
}
