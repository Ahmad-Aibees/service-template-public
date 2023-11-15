import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../../../common/validator/validator';

export class ApiUserChangePasswordRq {
    @ApiProperty({ description: 'token', required: true })
    @Validator({ title: 'token', required: true })
    token: string;

    @ApiProperty({ description: 'password', required: true })
    @Validator({ title: 'password', required: true })
    password: string;

    @ApiProperty({ description: 'rePassword', required: true })
    @Validator({ title: 'rePassword', required: true })
    rePassword: string;
}

export class ApiUserChangePasswordInsidePanelRq {
    @ApiProperty({ description: 'oldPassword', required: true })
    @Validator({ title: 'oldPassword', required: true })
    oldPassword: string;

    @ApiProperty({ description: 'password', required: true })
    @Validator({ title: 'password', required: true })
    password: string;

    @ApiProperty({ description: 'rePassword', required: true })
    @Validator({ title: 'rePassword', required: true })
    rePassword: string;
}
