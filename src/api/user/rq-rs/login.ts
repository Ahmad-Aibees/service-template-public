import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../common/types/role-type';
import { Validator } from '../../../common/validator/validator';

export class UserLoginInfo {
    @ApiProperty({ description: 'mobile' })
    mobile: string;

    @ApiProperty({ description: 'fullname' })
    firstName: string;

    @ApiProperty({ description: 'fullname' })
    lastName: string;

    @ApiProperty({ description: 'user role' })
    role: RoleType;
}

export class ApiUserLoginRq {
    @ApiProperty({ description: 'username', required: true })
    @Validator({ title: 'username', required: true })
    username: string;

    @ApiProperty({ description: 'password', required: true })
    @Validator({ title: 'password', required: true })
    password: string;
}

export class ApiUserLoginRs {
    @ApiProperty({ description: 'token' })
    token: string;

    @ApiProperty({ description: 'refreshToken' })
    refreshToken: string;

    @ApiProperty({ description: 'user', type: UserLoginInfo })
    user: UserLoginInfo;
}
