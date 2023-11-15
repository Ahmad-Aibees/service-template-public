import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../common/validator/validator';

// STATUS
export class ApiGeneralStatusRq {
    @ApiProperty({ description: 'status' })
    @Validator({ title: 'status', required: true, type: 'boolean' })
    active: boolean;
}

export class ApiGeneralStatusRs {
    @ApiProperty({ required: false, description: 'id' })
    id: string;
}

// DELETE
export class ApiGeneralDeleteRs {
    @ApiProperty({ required: false, description: 'id' })
    id: string;
}

// EXPORT FILE
export class ApiGeneralExportFileRs {
    @ApiProperty({ required: false, description: "file's name" })
    name: string;

    @ApiProperty({ required: false, description: "file's type" })
    mime: string;

    @ApiProperty({ required: false, description: "file's content" })
    content: string;
}
