import { ApiProperty } from '@nestjs/swagger';
import { RoleTypesList, RoleType } from '../../../common/types/role-type';
import { Validator } from '../../../common/validator/validator';
import { ApiAddUserRs } from './add';
import {FileType, FileTypesList} from "../../../common/types/file-type";

export class ApiUpdateUserRq {
    @ApiProperty({ required: true, description: 'username', pattern: "/^([a-z']+( )?)+$/i" })
    @Validator({ required: true, title: 'name', check: { pattern: /^([a-z']+( )?)+$/i } })
    fullname: string;

    @ApiProperty({ required: true, description: 'user email' })
    @Validator({ required: true, title: 'user email', check: { email: true } })
    email: string;

    @ApiProperty({ required: true, enum: RoleTypesList, description: 'user role' })
    @Validator({ required: true, title: 'user role', check: { in: RoleTypesList } })
    role: RoleType;

    @ApiProperty({ description: 'password', required: false })
    @Validator({ title: 'password', required: false })
    password: string;

    @ApiProperty({ required: false, description: 'user logo' })
    @Validator({ required: false, title: 'user logo' })
    avatar: string;
}
export class ApiUpdateUserRs extends ApiAddUserRs {}

export class ApiFileIdsRq {
    @ApiProperty({ enum: FileTypesList })
    @Validator({ title: 'fileType', required: true, check: { in: FileTypesList } })
    fileType: FileType;

    @ApiProperty()
    @Validator({ title: 'fileId', required: true, check: { objectId: true } })
    fileId: string;
}
