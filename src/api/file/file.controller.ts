import {Controller, Get, Param, Post, Req, Res, UseInterceptors} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiDefaultResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { CurrentIdentity } from '../../application/auth/decorator/current-user';
import { IsPublic } from '../../application/auth/decorator/meta-data/is-public';
import { Identity } from '../../application/auth/models/identity';
import { BodyMultipartFiles } from '../../common/decorator/multi-part/body-multipart-files';
import { BodyMultipartType } from '../../common/decorator/multi-part/body-multipart-type';
import { IFile } from '../../common/decorator/multi-part/utility/i-file';
import { FileService } from './file.service';
import { ApiFileUploadRs } from './rq-rs/upload';
import { Role } from '../../application/auth/decorator/meta-data/needs-permission';
import {Request, Response} from 'express';
import { ObjectIdPipe } from '../../common/pipes/object-id';
import { ApiCreateUrlRs } from './rq-rs/ApiCreateUrlRs';
import { Types } from 'mongoose';
import { RoleTypesList } from '../../common/types/role-type';
import {FileType, FileTypesList} from "../../common/types/file-type";

@Controller('file')
@ApiTags('File')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @ApiOperation({
        summary: 'upload file',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fileType: { enum: FileTypesList },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiDefaultResponse({ type: ApiFileUploadRs })
    @ApiBearerAuth()
    @Role(RoleTypesList)
    @Post()
    async upload(
        @BodyMultipartType({ field: 'fileType', type: 'enum', required: true, title: 'file type', enum: FileTypesList })
        fileType: FileType,
        @BodyMultipartFiles('file') file: IFile,
        @CurrentIdentity() identity: Identity,
        @Req() req: Request,
    ): Promise<ApiFileUploadRs> {
        return this.fileService.upload(fileType, identity, file, req);
    }

    @ApiOperation({
        summary: 'create download token',
    })
    @ApiDefaultResponse({ type: ApiCreateUrlRs })
    @ApiBearerAuth()
    @ApiParam({ name: 'fileId', type: 'string', description: 'file id' })
    @Role(RoleTypesList)
    @Get('/create-token/:fileId')
    async createUrl(
        @Param('fileId', new ObjectIdPipe('fileId')) fileId: Types.ObjectId,
        @CurrentIdentity() identity: Identity,
        @Req() req: Request
    ): Promise<ApiCreateUrlRs> {
        return this.fileService.createUrl(fileId, identity.userId, req);
    }

    @ApiOperation({
        summary: 'download file',
    })
    @ApiDefaultResponse({
        description: 'binary file',
    })
    @IsPublic()
    @Get(':fileToken')
    async download(
        @Param('fileToken') fileToken: string, @Res() response: Request
    ): Promise<void> {
        await this.fileService.download(fileToken, response);
    }
}
