import { Types } from 'mongoose';
import { RoleType } from '../../../common/types/role-type';

/**
 * It is extract from database using Payload of JWT
 */
export class Identity {
    userId: Types.ObjectId;
    actorType: RoleType;
    clientId?: Types.ObjectId;
    enabledProducts: { id: Types.ObjectId, name: string }[];
    profile: any;
    public get isAuthenticated(): boolean {
        return !!this.userId;
    }
}
