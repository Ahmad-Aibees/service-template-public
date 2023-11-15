import { RoleType } from '../../../common/types/role-type';
import { Types } from 'mongoose';

export class LoginResponse {
    actorType: RoleType;
    userId: Types.ObjectId;
    clientId: Types.ObjectId;
    token: string;
    refreshToken: string;
    user: {
        mobile: string,
        firstName: string,
        lastName: string,
        role: RoleType
    }

    constructor(response: Record<string, any>) {
        this.actorType = response.user?.role;
        this.userId = Types.ObjectId.createFromHexString(response.userId);
        this.clientId = Types.ObjectId.createFromHexString(response.clientId);
        this.token = response.token;
        this.refreshToken = response.refreshToken;
        this.user = response.user;
    }
}
