import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../../../common/validator/validator';
import { RoleType, RoleTypesList } from '../../../common/types/role-type';
import { userType, userTypesList } from '../../../common/types/user-type';

export class ApiAddApplicationUserRq {
    @ApiProperty({ required: true, description: 'mobile', pattern: "/^[\u0600-\u06FF\\s]+$/" })
    @Validator({ required: true, title: 'mobile', check: { pattern: /^[\u0600-\u06FF\s]+$/ } })
    mobile: string;

    @ApiProperty({ required: true, enum: RoleTypesList, description: 'user role' })
    @Validator({ required: true, title: 'user role', check: { in: userTypesList } })
    type: userType;
}
