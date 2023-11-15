import { ApiProperty } from '@nestjs/swagger';
import { PaginationModel } from '../../../application/pagination/model/pagination';
import * as moment from 'moment';
import { RoleType } from '../../../common/types/role-type';
import { Types } from 'mongoose';

export class UserInfo {
    @ApiProperty({ description: 'id' })
    id: string;

    @ApiProperty({ description: 'mobile' })
    mobile: string;

    @ApiProperty({ description: 'user role' })
    role: RoleType;

    @ApiProperty({ description: 'user username' })
    username: string;

    @ApiProperty({ description: 'user picture' })
    picture: string;

    @ApiProperty({ description: 'user firstName' })
    firstName: string;

    @ApiProperty({ description: 'user lastName' })
    lastName: string;

    @ApiProperty({ description: 'user phoneNumber' })
    phoneNumber: string;

    @ApiProperty({ description: 'user nationalCode' })
    nationalCode: string;

    @ApiProperty({ description: 'user birthday' })
    birthday: string;

    @ApiProperty({ description: 'user block' })
    block: boolean;

    @ApiProperty({ required: false, description: 'user last seen', example: ' 2d ago, 24h ago ,...' })
    lastSeen?: string;

    constructor(user: any, agencyId?: Types.ObjectId) {
        this.id = user.id;
        this.block = !!user.deactivated;
        this.role = user.role;
        this.username = user.username;
        this.firstName = user.profileInfo?.firstName;
        this.lastName = user.profileInfo?.lastName;
        this.phoneNumber = user.profileInfo?.phoneNumber;
        this.nationalCode = user.profileInfo?.nationalCode;
        this.birthday = user.profileInfo?.birthday.toDateString();
        this.picture = user?.picture?.url;
        this.role = user.role;
        if (agencyId) {
            const agency = user.clients.find(a => a.clientId === agencyId)
            this.lastSeen = agency ? moment(agency.lastSeen).fromNow() : null;
        }
    }
}

export class ApiUserListRs {
    @ApiProperty({ description: 'user list', type: [UserInfo], required: false })
    list: UserInfo[];

    @ApiProperty({
        type: PaginationModel,
        required: false,
        title: 'pagination',
        description: 'this is null, if list be empty',
    })
    pagination: PaginationModel;

    constructor(users: any[], pagination: PaginationModel) {
        this.list = users.map((c: any) => new UserInfo(c));

        this.pagination = pagination;
    }
}
