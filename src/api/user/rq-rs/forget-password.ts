import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../../../common/validator/validator';

export class ApiUserForgetPasswordRq {
    @ApiProperty({ description: 'userEmail', required: true })
    @Validator({ title: 'userEmail', required: true })
    userEmail: string;
}
