import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Validator } from '../../../common/validator/validator';
export class ApiRefreshTokenRq {
    @ApiProperty({ description: 'token', required: true })
    @Validator({ title: 'token', required: true })
    refreshToken: string;
}

export class ApiRefreshTokenRs {
    @ApiProperty({ description: 'token' })
    accessToken: string;
    @ApiProperty({ description: 'token' })
    refreshToken: string;
}

export class ApiRevokeRefreshTokenRs {
    @Validator({ title: 'Types.ObjectId', required: true,  check: { objectId: true }}, true)
    userIds: Array<Types.ObjectId>;
}
