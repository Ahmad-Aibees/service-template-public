import { Types } from 'mongoose';
import { RoleType } from '../../../common/types/role-type';

export class ProfileResponse {
    clientId: Types.ObjectId;
    userId: Types.ObjectId;
    actorType: RoleType;
    enabledProducts: { id: string, name: string }[];
    profile: any;

    constructor(response: Record<string, any>) {
        this.actorType = response.profile.role;
        this.userId = Types.ObjectId.createFromHexString(response.userId);
        this.clientId = Types.ObjectId.createFromHexString(response.clientId);
        this.enabledProducts = response.enabledProducts ?? [];
        this.profile = response.profile;
    }
}
