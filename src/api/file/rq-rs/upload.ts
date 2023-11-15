import { ApiProperty } from '@nestjs/swagger';

export class ApiFileUploadRs {
    @ApiProperty({ title: 'fileIds', isArray: true, items: { type: 'string'} })
    fileIds: string[];
}
