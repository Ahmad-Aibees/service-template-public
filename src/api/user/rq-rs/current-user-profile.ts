import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../common/types/role-type';

export class CurrentUserProfileRs {
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

    constructor(user: any) {
        this.mobile = user.mobile;
        this.role = user.role;
        this.username = user.username;
        this.firstName = user.profileInfo?.firstName;
        this.lastName = user.profileInfo?.lastName;
        this.phoneNumber = user.profileInfo?.phoneNumber;
        this.nationalCode = user.profileInfo?.nationalCode;
        this.birthday = user.profileInfo?.birthday.toDateString();
        this.picture = user?.picture?.url;
    }
}
