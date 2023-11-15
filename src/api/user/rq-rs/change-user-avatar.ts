import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../../../common/validator/validator';

export class ApiChsngeUserAvatarRq {
    @ApiProperty({ required: false, description: 'user logo' })
    @Validator({ required: false, title: 'user logo' })
    avatar: string;
}
