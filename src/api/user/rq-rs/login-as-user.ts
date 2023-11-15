import { ApiUserLoginRs } from './login';
import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../../../common/validator/validator';

export class ApiLoginAsUserRq {
    @ApiProperty({ required: true, type: 'string', description: 'regex: /(09)[0-9]{9}$/' })
    @Validator({ title: 'mobile', check: { pattern: /(09)[0-9]{9}$/ } })
    mobile: string;
}

export class ApiLoginAsUserRs extends ApiUserLoginRs {
}
