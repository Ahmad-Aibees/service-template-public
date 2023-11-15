import { ApiProperty } from '@nestjs/swagger';

export class ApiCreateUrlRs {
    @ApiProperty({ title: 'fileToken', type: 'string' })
    fileToken: string;

    @ApiProperty({ title: 'fileSize', type: 'string' })
    fileSize?: string;

    @ApiProperty({ title: 'fileName', type: 'string' })
    fileName?: string;

    constructor(data: { fileToken: string, fileName?: string, fileSize?: string }) {
        const { fileToken, fileName, fileSize } = data;
        this.fileToken = fileToken;
        this.fileName = fileName;
        this.fileSize = fileSize;
    }
}
